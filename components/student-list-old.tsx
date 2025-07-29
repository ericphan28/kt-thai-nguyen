"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  Phone, 
  Calendar, 
  Briefcase, 
  MapPin, 
  Heart,
  Search,
  Filter,
  MessageCircle,
  Loader2,
  RefreshCw,
  Edit,
  Mail,
  Facebook,
  ExternalLink,
  ChevronDown
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  ho_ten: string
  mssv: string
  email: string
  sdt: string
  sdt_zalo: string
  ten_hien_thi_zalo: string
  link_facebook: string
  ten_hien_thi_facebook: string
  nam_sinh: string
  cong_viec: string
  kinh_nghiem: string
  noi_o: string
  so_thich: string[]
  created_at?: string
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSoThich, setFilterSoThich] = useState("")

  // Fetch students data from API
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/students')
      
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      } else {
        setError('Không thể tải danh sách sinh viên')
      }
    } catch (err) {
      console.error('Error fetching students:', err)
      setError('Có lỗi kết nối. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Get all unique sở thích for filter
  const allSoThich = Array.from(
    new Set(students.flatMap(student => student.so_thich))
  ).sort()

  // Filter students based on search and filter criteria
  const filteredStudents = students.filter(student => {
    const matchSearch = student.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.mssv.includes(searchTerm) ||
                       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.noi_o.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchFilter = !filterSoThich || student.so_thich.includes(filterSoThich)
    
    return matchSearch && matchFilter
  })

  // Function xóa sinh viên - chỉ dành cho admin
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (studentId: string, studentName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thông tin của ${studentName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert("Xóa thông tin thành công!")
        fetchStudents() // Refresh danh sách
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Có lỗi xảy ra khi xóa thông tin")
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert("Có lỗi xảy ra khi xóa thông tin")
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Đang tải danh sách sinh viên...
            </h3>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="shadow-lg border-0 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
      {/* Search and Filter */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-green-500" />
              Tìm kiếm & Lọc
            </div>
            <Button
              onClick={fetchStudents}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <Input
                placeholder="Tìm theo tên, MSSV, email, hoặc nơi ở..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Lọc theo sở thích</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!filterSoThich ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    !filterSoThich
                      ? "bg-green-500 hover:bg-green-600"
                      : "hover:bg-green-50 dark:hover:bg-green-900/30"
                  }`}
                  onClick={() => setFilterSoThich("")}
                >
                  Tất cả
                </Badge>
                {allSoThich.map((soThich) => (
                  <Badge
                    key={soThich}
                    variant={filterSoThich === soThich ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filterSoThich === soThich
                        ? "bg-green-500 hover:bg-green-600"
                        : "hover:bg-green-50 dark:hover:bg-green-900/30"
                    }`}
                    onClick={() => setFilterSoThich(soThich)}
                  >
                    {soThich}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Hiển thị {filteredStudents.length} / {students.length} sinh viên
            </span>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Tổng: {students.length} sinh viên
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <Card 
            key={student.id} 
            className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold">
                      #{index + 1}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {student.ho_ten}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{student.mssv}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-medium">
                  {student.cong_viec}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <a 
                    href={`mailto:${student.email}`}
                    className="font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200 hover:underline"
                  >
                    {student.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <a 
                    href={`tel:${student.sdt}`}
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                  >
                    {student.sdt}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <div className="flex items-center gap-2">
                    <span>Zalo: </span>
                    <a 
                      href={`tel:${student.sdt_zalo}`}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 hover:underline font-medium"
                      title="Gọi Zalo"
                    >
                      {student.ten_hien_thi_zalo}
                    </a>
                    <span className="text-gray-500">({student.sdt_zalo})</span>
                  </div>
                </div>
                
                {student.link_facebook && (
                  <div className="flex items-center gap-2 text-sm">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <div className="flex items-center gap-2">
                      <span>Facebook: </span>
                      <a
                        href={student.link_facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium flex items-center gap-1"
                        title="Mở Facebook"
                      >
                        {student.ten_hien_thi_facebook}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>Sinh năm {student.nam_sinh}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Công việc: {student.cong_viec}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{student.noi_o}</span>
                </div>
              </div>

              {/* Kinh nghiệm */}
              {student.kinh_nghiem && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Kinh nghiệm</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {student.kinh_nghiem}
                  </p>
                </div>
              )}

              {/* Sở thích */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Sở thích</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {student.so_thich.map((soThich) => (
                    <Badge
                      key={soThich}
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                    >
                      {soThich}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Liên hệ
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => window.open(`mailto:${student.email}`)}>
                      <Mail className="w-4 h-4 mr-2 text-purple-500" />
                      Gửi Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`tel:${student.sdt}`)}>
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      Gọi điện thoại
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`tel:${student.sdt_zalo}`)}>
                      <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                      Gọi Zalo
                    </DropdownMenuItem>
                    {student.link_facebook && (
                      <DropdownMenuItem onClick={() => window.open(student.link_facebook, "_blank")}>
                        <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                        Mở Facebook
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="hover:bg-orange-50 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                >
                  <Link href={`/student-edit/${student.id}`}>
                    <Edit className="w-4 h-4 text-orange-500" />
                  </Link>
                </Button>
                
                {/* Nút xóa đã được ẩn - admin có thể bỏ comment để sử dụng */}
                {/* 
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(student.id, student.ho_ten)}
                  className="hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy sinh viên nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  )
}
