"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { User, Calendar, Briefcase, MapPin, Heart, Mail, UserPlus, ArrowLeft } from "lucide-react"
import { validateEmail, validatePhone, validateMSSV, validateName, validateFacebookUrl, validateBirthYear } from "@/lib/validation"

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
  "Bóng đá", "Cầu lông", "Tennis", "Bóng bàn", "Võ thuật", "Chạy bộ/Gym", "Bơi lội", "Âm nhạc",
  "Ca hát", "Nhạc cụ", "Game", "Đọc sách", "Du lịch", "Nấu ăn", "Phim ảnh", "Nhiếp ảnh",
  "Lập trình", "Vẽ/Thiết kế", "Khiêu vũ", "Yoga", "Câu cá", "Làm vườn", "Thời trang", "Mua sắm", "Karaoke", "Board game"
]

const CONG_VIEC_OPTIONS = [
  "Sinh viên", "Học sinh", "Thực tập sinh", "Thất nghiệp/Tìm việc", "Nghỉ việc tạm thời", "Nội trợ", "Hưu trí",
  "Kinh doanh tự do", "Bán hàng online", "Chủ shop/cửa hàng", "Freelancer", "Làm nhiều job", "Nhân viên văn phòng",
  "Kế toán", "Nhân viên ngân hàng", "Giáo viên/Giảng viên", "Gia sư", "Bác sĩ/Y tá", "Dược sĩ", "Kỹ sư",
  "Lập trình viên/IT", "Thiết kế đồ họa", "Marketing/Sales", "Nhân viên bán hàng", "Tư vấn viên", "Phục vụ nhà hàng/Cafe",
  "Đầu bếp/Phụ bếp", "Shipper/Xe ôm", "Tài xế", "Thợ may", "Thợ cắt tóc", "Thợ sửa chữa", "Công nhân", "Bảo vệ",
  "Nhân viên y tế", "Công chức/Viên chức", "Quân đội/Công an", "Streamer/Content creator", "Ca sĩ/Nghệ sĩ",
  "Nông dân/Làm ruộng", "Nuôi trồng thủy sản", "Khác"
]

export function StudentInfoForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    hoTen: "", mssv: "", email: "", sdt: "", sdtZalo: "", tenHienThiZalo: "",
    linkFacebook: "", tenHienThiFacebook: "", namSinh: "", congViec: "",
    kinhNghiem: "", noiO: "", soThich: []
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { showToast, ToastContainer } = useToast()

  const validateField = (field: keyof FormData, value: string) => {
    let error: string | null = null
    
    switch (field) {
      case 'hoTen': error = validateName(value); break
      case 'mssv': error = validateMSSV(value); break
      case 'email': error = validateEmail(value); break
      case 'sdt': case 'sdtZalo': error = validatePhone(value); break
      case 'linkFacebook': error = validateFacebookUrl(value); break
      case 'namSinh': error = validateBirthYear(value); break
    }

    setErrors(prev => ({ ...prev, [field]: error }))
    return error === null
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (value.trim()) {
      validateField(field, value)
    } else {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
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
    
    const requiredFields: (keyof FormData)[] = ['hoTen', 'mssv', 'email', 'sdt', 'sdtZalo', 'tenHienThiZalo']
    let hasErrors = false
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field] as string)) {
        hasErrors = true
      }
    })
    
    if (formData.linkFacebook && !validateField('linkFacebook', formData.linkFacebook)) {
      hasErrors = true
    }
    if (formData.namSinh && !validateField('namSinh', formData.namSinh)) {
      hasErrors = true
    }
    
    if (hasErrors) {
      showToast("Vui lòng kiểm tra lại thông tin đã nhập!", "error")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Student created:", result)
        
        const successMessage = `🎉 Đăng ký thành công!\n\n✅ Chào mừng ${formData.hoTen} gia nhập lớp VB2!\n📋 MSSV: ${formData.mssv}\n📧 Email: ${formData.email}\n📱 Zalo: ${formData.sdtZalo}\n\n⏰ Đang chuyển đến danh sách lớp...`
        showToast(successMessage, "success")
        
        setIsRedirecting(true)
        setTimeout(() => {
          router.push('/student-list')
        }, 2000)
      } else {
        const error = await response.json()
        console.error("Error creating student:", error)
        
        if (error.message && error.message.includes("duplicate key")) {
          if (error.message.includes("mssv")) {
            showToast("MSSV này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!", "error")
          } else if (error.message.includes("email")) {
            showToast("Email này đã được đăng ký. Vui lòng sử dụng email khác!", "error")
          } else {
            showToast("Thông tin này đã tồn tại. Vui lòng kiểm tra lại!", "error")
          }
        } else {
          showToast(error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!", "error")
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      showToast("Có lỗi kết nối. Vui lòng kiểm tra internet và thử lại!", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.push('/student-list')
  }

  const isFormValid = formData.hoTen && formData.mssv && formData.email && formData.sdt && formData.sdtZalo && formData.tenHienThiZalo

  return (
    <>
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Đăng Ký Thông Tin
          </CardTitle>
          <CardDescription className="text-base">
            Gia nhập lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cơ bản</h3>
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
                    className={`transition-all duration-200 focus:ring-2 ${
                      errors.hoTen ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isRedirecting}
                    required
                  />
                  {errors.hoTen && <p className="text-sm text-red-600">{errors.hoTen}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mssv" className="text-sm font-medium">
                    MSSV <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mssv"
                    placeholder="Ví dụ: kh635886"
                    value={formData.mssv}
                    onChange={(e) => handleInputChange("mssv", e.target.value)}
                    className={`transition-all duration-200 focus:ring-2 ${
                      errors.mssv ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isRedirecting}
                    required
                  />
                  {errors.mssv && <p className="text-sm text-red-600">{errors.mssv}</p>}
                </div>
              </div>

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
                  className={`transition-all duration-200 focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  disabled={isSubmitting || isRedirecting}
                  required
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
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
                    className={`transition-all duration-200 focus:ring-2 ${
                      errors.sdt ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isRedirecting}
                    required
                  />
                  {errors.sdt && <p className="text-sm text-red-600">{errors.sdt}</p>}
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
                    className={`transition-all duration-200 focus:ring-2 ${
                      errors.sdtZalo ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isRedirecting}
                    required
                  />
                  {errors.sdtZalo && <p className="text-sm text-red-600">{errors.sdtZalo}</p>}
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
                    disabled={isSubmitting || isRedirecting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkFacebook" className="text-sm font-medium">Link Facebook</Label>
                  <Input
                    id="linkFacebook"
                    placeholder="https://facebook.com/your-profile"
                    value={formData.linkFacebook}
                    onChange={(e) => handleInputChange("linkFacebook", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting || isRedirecting}
                  />
                  {errors.linkFacebook && <p className="text-sm text-red-600">{errors.linkFacebook}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenHienThiFacebook" className="text-sm font-medium">Tên hiển thị Facebook</Label>
                  <Input
                    id="tenHienThiFacebook"
                    placeholder="Thang Phan"
                    value={formData.tenHienThiFacebook}
                    onChange={(e) => handleInputChange("tenHienThiFacebook", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting || isRedirecting}
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
                    disabled={isSubmitting || isRedirecting}
                  />
                  {errors.namSinh && <p className="text-sm text-red-600">{errors.namSinh}</p>}
                  <p className="text-xs text-gray-500">Nhập năm từ 1960 đến 2025</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="congViec" className="text-sm font-medium">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Công việc hiện tại
                  </Label>
                  <Select value={formData.congViec} onValueChange={(value) => handleInputChange("congViec", value)} disabled={isSubmitting || isRedirecting}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn công việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONG_VIEC_OPTIONS.map((job) => (
                        <SelectItem key={job} value={job}>{job}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    disabled={isSubmitting || isRedirecting}
                  />
                </div>
              </div>
            </div>

            {/* Kinh nghiệm */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kinh nghiệm & Kỹ năng</h3>
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
                  disabled={isSubmitting || isRedirecting}
                />
              </div>
            </div>

            {/* Sở thích */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sở thích</h3>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Chọn những sở thích của bạn (có thể chọn nhiều)</Label>
                <div className="flex flex-wrap gap-2">
                  {SO_THICH_OPTIONS.map((soThich) => (
                    <Badge
                      key={soThich}
                      variant={formData.soThich.includes(soThich) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.soThich.includes(soThich)
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                          : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      } ${isSubmitting || isRedirecting ? 'cursor-not-allowed opacity-50' : ''}`}
                      onClick={() => !isSubmitting && !isRedirecting && handleSoThichToggle(soThich)}
                    >
                      {soThich}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting || isRedirecting}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
              >
                {isRedirecting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang chuyển đến danh sách lớp...
                  </div>
                ) : isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đăng ký...
                  </div>
                ) : (
                  "Đăng ký gia nhập lớp"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting || isRedirecting}
                className="w-full h-12 text-lg font-medium border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại danh sách lớp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  )
}
