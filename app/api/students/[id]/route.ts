import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// GET - Lấy thông tin sinh viên theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Không tìm thấy sinh viên' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải thông tin sinh viên' },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật thông tin sinh viên
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT request received')
    
    // Parse params first
    let id: string
    try {
      const resolvedParams = await params
      id = resolvedParams.id
      console.log('Student ID from params:', id)
      
      if (!id) {
        console.error('No ID provided in params')
        return NextResponse.json(
          { 
            error: 'ID sinh viên không được tìm thấy',
            success: false
          },
          { status: 400 }
        )
      }
    } catch (paramError) {
      console.error('Error parsing params:', paramError)
      return NextResponse.json(
        { 
          error: 'Lỗi trong việc đọc thông tin request',
          details: paramError instanceof Error ? paramError.message : 'Unknown error',
          success: false
        },
        { status: 400 }
      )
    }

    // Parse form data
    let formData: Record<string, unknown>
    try {
      formData = await request.json()
      console.log('Form data received:', formData)
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError)
      return NextResponse.json(
        { 
          error: 'Dữ liệu gửi lên không hợp lệ',
          details: jsonError instanceof Error ? jsonError.message : 'Invalid JSON',
          success: false
        },
        { status: 400 }
      )
    }

    // Create Supabase admin client to bypass RLS
    let supabase: ReturnType<typeof createServiceClient>
    try {
      supabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      console.log('Supabase admin client created successfully')
    } catch (supabaseError) {
      console.error('Error creating Supabase admin client:', supabaseError)
      return NextResponse.json(
        { 
          error: 'Lỗi kết nối cơ sở dữ liệu',
          details: supabaseError instanceof Error ? supabaseError.message : 'Database connection failed',
          success: false
        },
        { status: 500 }
      )
    }

    // Convert camelCase to snake_case for database
    const dbData = {
      ho_ten: formData.hoTen as string,
      mssv: formData.mssv as string,
      email: formData.email as string,
      sdt: formData.sdt as string,
      sdt_zalo: formData.sdtZalo as string,
      ten_hien_thi_zalo: formData.tenHienThiZalo as string,
      link_facebook: (formData.linkFacebook as string) || null,
      ten_hien_thi_facebook: (formData.tenHienThiFacebook as string) || null,
      nam_sinh: (formData.namSinh as string) || null,
      cong_viec: (formData.congViec as string) || null,
      kinh_nghiem: (formData.kinhNghiem as string) || null,
      noi_o: (formData.noiO as string) || null,
      so_thich: (formData.soThich as string[]) || []
    }

    console.log('Database data to update:', dbData)

    // First, check if the student exists
    const { data: existingStudent, error: checkError } = await supabase
      .from('students')
      .select('*')  // Select all fields to see current data
      .eq('id', id)
      .single()

    console.log('Existing student check - data:', existingStudent, 'error:', checkError)

    if (checkError || !existingStudent) {
      console.log('Student not found during existence check')
      return NextResponse.json(
        { 
          error: 'Không tìm thấy sinh viên để cập nhật',
          success: false,
          studentId: id
        },
        { status: 404 }
      )
    }

    // Use admin client with service role - should bypass RLS
    console.log('Proceeding with admin update using service role...')
    const { data: updateData, error: updateError } = await supabase
      .from('students')
      .update(dbData)
      .eq('id', id)
      .select()

    console.log('Admin update result - data:', updateData, 'error:', updateError)

    if (updateError) {
      console.error('Admin update error:', updateError)
      return NextResponse.json(
        { 
          error: 'Lỗi cơ sở dữ liệu khi cập nhật thông tin',
          details: updateError.message,
          success: false
        },
        { status: 500 }
      )
    }

    if (!updateData || updateData.length === 0) {
      console.error('Admin update returned no data')
      return NextResponse.json(
        { 
          error: 'Không thể cập nhật thông tin sinh viên. Vui lòng thử lại sau.',
          success: false,
          studentId: id
        },
        { status: 404 }
      )
    }

    // Success!
    return NextResponse.json({
      message: 'Cập nhật thông tin thành công',
      student: updateData[0],
      success: true
    })
  } catch (error) {
    console.error('Error updating student:', error)
    
    // Ensure we always return a proper JSON response
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi không xác định xảy ra'
    
    return NextResponse.json(
      { 
        error: 'Có lỗi xảy ra khi cập nhật thông tin sinh viên',
        details: errorMessage,
        success: false
      },
      { status: 500 }
    )
  }
}

// DELETE - Xóa sinh viên
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Xóa thông tin thành công',
      student: data
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa thông tin' },
      { status: 500 }
    )
  }
}
