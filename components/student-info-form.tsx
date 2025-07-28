"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Briefcase, MapPin, Heart, GraduationCap, Mail } from "lucide-react"

interface FormData {
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
}

const SO_THICH_OPTIONS = [
  "Bóng đá",
  "Cầu lông", 
  "Tennis",
  "Bóng bàn",
  "Võ thuật",
  "Chạy bộ/Gym",
  "Bơi lội",
  "Âm nhạc",
  "Ca hát", 
  "Nhạc cụ",
  "Game",
  "Đọc sách",
  "Du lịch",
  "Nấu ăn",
  "Phim ảnh",
  "Nhiếp ảnh",
  "Lập trình",
  "Vẽ/Thiết kế",
  "Khiêu vũ",
  "Yoga",
  "Câu cá",
  "Làm vườn",
  "Thời trang",
  "Mua sắm",
  "Karaoke",
  "Board game"
]

const CONG_VIEC_OPTIONS = [
  "Sinh viên",
  "Học sinh",
  "Thực tập sinh",
  "Thất nghiệp/Tìm việc",
  "Nghỉ việc tạm thời",
  "Nội trợ",
  "Hưu trí",
  "Kinh doanh tự do",
  "Bán hàng online",
  "Chủ shop/cửa hàng",
  "Freelancer",
  "Làm nhiều job",
  "Nhân viên văn phòng",
  "Kế toán",
  "Nhân viên ngân hàng",
  "Giáo viên/Giảng viên",
  "Gia sư",
  "Bác sĩ/Y tá",
  "Dược sĩ",
  "Kỹ sư",
  "Lập trình viên/IT",
  "Thiết kế đồ họa",
  "Marketing/Sales",
  "Nhân viên bán hàng",
  "Tư vấn viên",
  "Phục vụ nhà hàng/Cafe",
  "Đầu bếp/Phụ bếp",
  "Shipper/Xe ôm",
  "Tài xế",
  "Thợ may",
  "Thợ cắt tóc",
  "Thợ sửa chữa",
  "Công nhân",
  "Bảo vệ",
  "Nhân viên y tế",
  "Công chức/Viên chức",
  "Quân đội/Công an",
  "Streamer/Content creator",
  "Ca sĩ/Nghệ sĩ",
  "Nông dân/Làm ruộng",
  "Nuôi trồng thủy sản",
  "Khác"
]

export function StudentInfoForm() {
  const [formData, setFormData] = useState<FormData>({
    hoTen: "",
    mssv: "",
    email: "",
    sdt: "",
    sdtZalo: "",
    tenHienThiZalo: "",
    linkFacebook: "",
    tenHienThiFacebook: "",
    namSinh: "",
    congViec: "",
    kinhNghiem: "",
    noiO: "",
    soThich: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSoThichToggle = (soThich: string) => {
    setFormData(prev => ({
      ...prev,
      soThich: prev.soThich.includes(soThich)
        ? prev.soThich.filter(st => st !== soThich)
        : [...prev.soThich, soThich]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedStudent = await response.json()
        console.log("Student saved:", savedStudent)
        alert("Thông tin đã được lưu thành công!")
        
        // Reset form sau khi lưu thành công
        setFormData({
          hoTen: "",
          mssv: "",
          email: "",
          sdt: "",
          sdtZalo: "",
          tenHienThiZalo: "",
          linkFacebook: "",
          tenHienThiFacebook: "",
          namSinh: "",
          congViec: "",
          kinhNghiem: "",
          noiO: "",
          soThich: []
        })
      } else {
        const error = await response.json()
        console.error("Error saving student:", error)
        alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!")
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Có lỗi kết nối. Vui lòng kiểm tra internet và thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.hoTen && formData.mssv && formData.sdt && formData.sdtZalo && formData.tenHienThiZalo

  return (
    <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Đăng Ký Thông Tin
        </CardTitle>
        <CardDescription className="text-base">
          Vui lòng điền đầy đủ thông tin để tham gia vào cộng đồng lớp VB2
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thông tin cơ bản
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoTen" className="text-sm font-medium">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hoTen"
                  placeholder="Nguyễn Văn A"
                  value={formData.hoTen}
                  onChange={(e) => handleInputChange("hoTen", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mssv" className="text-sm font-medium">
                  MSSV <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mssv"
                  placeholder="1234567890"
                  value={formData.mssv}
                  onChange={(e) => handleInputChange("mssv", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <Mail className="w-4 h-4 inline mr-1 text-purple-500" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nguyenvana@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sdt" className="text-sm font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sdt"
                  placeholder="0123456789"
                  value={formData.sdt}
                  onChange={(e) => handleInputChange("sdt", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sdtZalo" className="text-sm font-medium">
                  Số Zalo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sdtZalo"
                  placeholder="0907136029"
                  value={formData.sdtZalo}
                  onChange={(e) => handleInputChange("sdtZalo", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenHienThiZalo" className="text-sm font-medium">
                  Tên hiển thị Zalo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tenHienThiZalo"
                  placeholder="Thang Phan"
                  value={formData.tenHienThiZalo}
                  onChange={(e) => handleInputChange("tenHienThiZalo", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkFacebook" className="text-sm font-medium">
                  Link Facebook
                </Label>
                <Input
                  id="linkFacebook"
                  placeholder="https://facebook.com/your-profile"
                  value={formData.linkFacebook}
                  onChange={(e) => handleInputChange("linkFacebook", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenHienThiFacebook" className="text-sm font-medium">
                  Tên hiển thị Facebook
                </Label>
                <Input
                  id="tenHienThiFacebook"
                  placeholder="Thang Phan"
                  value={formData.tenHienThiFacebook}
                  onChange={(e) => handleInputChange("tenHienThiFacebook", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="namSinh" className="text-sm font-medium">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Năm sinh
                </Label>
                <Input
                  id="namSinh"
                  type="number"
                  min="1960"
                  max="2025"
                  placeholder="Ví dụ: 2002"
                  value={formData.namSinh}
                  onChange={(e) => handleInputChange("namSinh", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Nhập năm từ 1960 đến 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="congViec" className="text-sm font-medium">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Công việc hiện tại
                </Label>
                <Select onValueChange={(value) => handleInputChange("congViec", value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn công việc" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONG_VIEC_OPTIONS.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noiO" className="text-sm font-medium">
                <MapPin className="w-4 h-4 inline mr-1" />
                Nơi ở hiện tại
              </Label>
              <Input
                id="noiO"
                placeholder="Ví dụ: Thái Nguyên, Hà Nội..."
                value={formData.noiO}
                onChange={(e) => handleInputChange("noiO", e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Kinh nghiệm */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Kinh nghiệm & Kỹ năng
              </h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kinhNghiem" className="text-sm font-medium">
                Có kinh nghiệm gì? (Ví dụ: nấu ăn, IT, thiết kế...)
              </Label>
              <Textarea
                id="kinhNghiem"
                placeholder="Mô tả ngắn gọn về kinh nghiệm, kỹ năng bạn có..."
                value={formData.kinhNghiem}
                onChange={(e) => handleInputChange("kinhNghiem", e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Sở thích */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sở thích
              </h3>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Chọn những sở thích của bạn (có thể chọn nhiều)
              </Label>
              <div className="flex flex-wrap gap-2">
                {SO_THICH_OPTIONS.map((soThich) => (
                  <Badge
                    key={soThich}
                    variant={formData.soThich.includes(soThich) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.soThich.includes(soThich)
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                        : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    }`}
                    onClick={() => handleSoThichToggle(soThich)}
                  >
                    {soThich}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang gửi...
                </div>
              ) : (
                "Đăng ký thông tin"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
