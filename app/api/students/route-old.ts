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

    // Gọi function register_student để tự động tạo tài khoản
    const { data, error } = await supabase
      .rpc('register_student', {
        student_data: studentData,
        use_email_login: true // Sử dụng email để đăng nhập
      })

    if (error) {
      console.error('Error registering student:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
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

  } catch (error) {
    console.error('Error saving student data:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
