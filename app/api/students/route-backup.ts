import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
        console.error('Function error:', error)
        throw error
      }

      if (!data.success) {
        return NextResponse.json({ 
          error: data.error, 
          message: data.message 
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        student_id: data.student_id,
        message: data.message,
        login_info: {
          username: data.login_identifier,
          temp_password: data.temp_password
        }
      }, { status: 201 })

    } catch (functionError) {
      console.error('Function failed, trying direct insert:', functionError)
      
      // Fallback: Direct insert
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()

      if (error) {
        console.error('Direct insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Generate temp password for manual account creation
      const tempPassword = 'TempPass' + body.sdt.slice(-4) + '!'
      
      return NextResponse.json({
        success: true,
        student_id: data[0].id,
        message: `Đăng ký thông tin thành công! Để đăng nhập, hãy tạo tài khoản với email: ${body.email} và mật khẩu: ${tempPassword}`,
        login_info: {
          username: body.email,
          temp_password: tempPassword
        }
      }, { status: 201 })
    }

  } catch (error) {
    console.error('Error saving student data:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
