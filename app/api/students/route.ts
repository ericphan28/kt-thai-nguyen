import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface Student {
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
  createdAt?: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'students.json')

export async function GET() {
  try {
    // Đảm bảo thư mục data tồn tại
    const dataDir = path.dirname(DATA_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Đọc file students.json
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8')
      const students = JSON.parse(data)
      return NextResponse.json(students)
    } catch {
      // Nếu file không tồn tại, trả về mảng rỗng
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error reading students data:', error)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newStudent = await request.json()
    
    // Đảm bảo thư mục data tồn tại
    const dataDir = path.dirname(DATA_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Đọc dữ liệu hiện tại
    let students: Student[] = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8')
      students = JSON.parse(data)
    } catch {
      // File không tồn tại, khởi tạo mảng rỗng
      students = []
    }

    // Tạo ID mới
    const newId = students.length > 0 
      ? Math.max(...students.map((s: Student) => parseInt(s.id) || 0)) + 1 
      : 1

    // Thêm student mới
    const studentWithId = {
      ...newStudent,
      id: newId.toString(),
      createdAt: new Date().toISOString()
    }

    students.push(studentWithId)

    // Lưu vào file
    await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), 'utf8')

    return NextResponse.json(studentWithId, { status: 201 })
  } catch (error) {
    console.error('Error saving student data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
