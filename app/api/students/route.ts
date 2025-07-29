import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { validateMSSVBoolean } from '@/lib/validation'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    console.log('Received data:', body)

    // Validate MSSV format
    if (!body.mssv || !validateMSSVBoolean(body.mssv)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid MSSV format',
        message: 'MSSV không đúng định dạng. Vui lòng nhập MSSV có ít nhất 5 ký tự'
      }, { status: 400 })
    }

    // Chuyển đổi từ camelCase sang snake_case để phù hợp với database
    const studentData = {
      ho_ten: body.hoTen,
      mssv: body.mssv,
      email: body.email,
      sdt: body.sdt,
      sdt_zalo: body.sdtZalo,
      ten_hien_thi_zalo: body.tenHienThiZalo,
      link_facebook: body.linkFacebook,
      ten_hien_thi_facebook: body.tenHienThiFacebook,
      nam_sinh: body.namSinh,
      cong_viec: body.congViec,
      kinh_nghiem: body.kinhNghiem,
      noi_o: body.noiO,
      so_thich: body.soThich || []
    }

    console.log('Converted data:', studentData)

    // Try using the function first
    try {
      const { data, error } = await supabase
        .rpc('register_student', {
          student_data: studentData,
          use_email_login: true
        })

      if (error) {
        // Log nhẹ thay vì console.error để tránh trigger development overlay
        console.warn('Database function not available:', error.message)
        throw error
      }

      if (!data.success) {
        return NextResponse.json({ 
          success: false,
          error: data.error, 
          message: data.message 
        }, { status: 400 })
      }

      // Tạo auth user sau khi student record đã được tạo thành công
      let authUserCreated = false
      try {
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const adminClient = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY
          )

          const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
            email: data.login_identifier,
            password: data.temp_password,
            email_confirm: true,
            user_metadata: {
              ho_ten: body.hoTen,
              mssv: body.mssv,
              student_id: data.student_id
            }
          })

          if (!authError && authUser.user) {
            authUserCreated = true
            
            // Cập nhật student record với auth_uid (theo schema)
            await supabase
              .from('students')
              .update({ auth_uid: authUser.user.id })
              .eq('id', data.student_id)
          }
        }
      } catch (authErr) {
        // Không fail toàn bộ request nếu auth creation fail
        console.warn('Auth user creation failed:', authErr)
      }

      return NextResponse.json({
        success: true,
        student_id: data.student_id,
        message: data.message,
        auth_user_created: authUserCreated,
        login_info: {
          username: data.login_identifier,
          temp_password: data.temp_password
        }
      }, { status: 201 })

    } catch (functionError) {
      console.warn('Function failed, trying direct insert:', functionError instanceof Error ? functionError.message : 'Unknown error')
      
      // Use service role key for direct insert to bypass RLS
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      // Check for duplicate MSSV first
      const { data: existingMSSV, error: checkError } = await adminClient
        .from('students')
        .select('id')
        .eq('mssv', body.mssv)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('MSSV check error:', checkError.message)
        return NextResponse.json({ 
          success: false,
          error: 'Lỗi kiểm tra MSSV',
          message: 'Có lỗi xảy ra khi kiểm tra MSSV'
        }, { status: 500 })
      }

      if (existingMSSV) {
        return NextResponse.json({ 
          success: false,
          error: 'Duplicate MSSV',
          message: 'MSSV đã tồn tại trong hệ thống'
        }, { status: 400 })
      }
      
      // Fallback: Direct insert with admin client
      const { data, error } = await adminClient
        .from('students')
        .insert([studentData])
        .select()

      if (error) {
        console.warn('Direct insert error:', error.message)
        return NextResponse.json({ 
          success: false,
          error: error.message,
          message: 'Có lỗi xảy ra khi lưu dữ liệu'
        }, { status: 500 })
      }

      // Generate temp password for manual account creation
      const tempPassword = 'TempPass' + body.sdt.slice(-4) + '!'
      
      // Cũng tạo auth user cho fallback case using existing admin client
      let authUserCreated = false
      try {
        const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
          email: body.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            ho_ten: body.hoTen,
            mssv: body.mssv,
            student_id: data[0].id
          }
        })

        if (!authError && authUser.user) {
          authUserCreated = true
          
          // Cập nhật student record với auth_uid using admin client
          await adminClient
            .from('students')
            .update({ auth_uid: authUser.user.id })
            .eq('id', data[0].id)
        }
      } catch (authErr) {
        console.warn('Auth user creation failed in fallback:', authErr)
      }
      
      return NextResponse.json({
        success: true,
        student_id: data[0].id,
        message: `Đăng ký thông tin thành công! ${authUserCreated ? 'Tài khoản đăng nhập đã được tạo sẵn.' : 'Thông tin đã được lưu.'}`,
        auth_user_created: authUserCreated,
        login_info: {
          username: body.email,
          temp_password: tempPassword
        }
      }, { status: 201 })
    }

  } catch (error) {
    console.warn('Error saving student data:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) {
      return NextResponse.json({ 
        success: false,
        error: error.message,
        message: 'Có lỗi xảy ra khi xử lý dữ liệu'
      }, { status: 500 })
    }
    return NextResponse.json({ 
      success: false,
      error: 'Failed to save data',
      message: 'Không thể lưu dữ liệu'
    }, { status: 500 })
  }
}
