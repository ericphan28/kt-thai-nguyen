import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export interface Student {
  id: string
  hoTen: string
  mssv: string
  email: string
  sdt: string
  sdtZalo: string
  tenHienThiZalo: string
  linkFacebook: string
  tenHienThiFacebook: string
  namSinh: string
  congViec: string
  kinhNghiem: string
  noiO: string
  soThich: string[]
  createdAt: string
  updatedAt?: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'students.json')

// PUT - Cập nhật thông tin sinh viên
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updatedData = await request.json()

    // Đọc dữ liệu hiện tại
    let students: Student[] = []
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf8')
      students = JSON.parse(fileData)
    } catch {
      console.log('File not found, creating new file')
    }

    // Tìm và cập nhật sinh viên
    const studentIndex = students.findIndex(student => student.id === id)
    
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sinh viên' },
        { status: 404 }
      )
    }

    // Cập nhật thông tin
    students[studentIndex] = {
      ...students[studentIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }

    // Ghi lại file
    await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2))

    return NextResponse.json({ 
      message: 'Cập nhật thông tin thành công',
      student: students[studentIndex]
    })

  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật thông tin' },
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

    // Đọc dữ liệu hiện tại
    let students: Student[] = []
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf8')
      students = JSON.parse(fileData)
    } catch {
      return NextResponse.json(
        { error: 'Không tìm thấy file dữ liệu' },
        { status: 404 }
      )
    }

    // Tìm và xóa sinh viên
    const studentIndex = students.findIndex(student => student.id === id)
    
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy sinh viên' },
        { status: 404 }
      )
    }

    const deletedStudent = students.splice(studentIndex, 1)[0]

    // Ghi lại file
    await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2))

    return NextResponse.json({ 
      message: 'Xóa thông tin thành công',
      student: deletedStudent
    })

  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa thông tin' },
      { status: 500 }
    )
  }
}
