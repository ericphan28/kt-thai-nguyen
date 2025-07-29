"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { User, Calendar, Briefcase, MapPin, Heart, Mail, Edit, ArrowLeft, AlertCircle } from "lucide-react"
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

interface StudentEditFormProps {
  studentId: string
}

export function StudentEditForm({ studentId }: StudentEditFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    hoTen: "", mssv: "", email: "", sdt: "", sdtZalo: "", tenHienThiZalo: "",
    linkFacebook: "", tenHienThiFacebook: "", namSinh: "", congViec: "",
    kinhNghiem: "", noiO: "", soThich: []
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [studentNotFound, setStudentNotFound] = useState(false)
  const { showToast, ToastContainer } = useToast()

  // Load student data
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}`)
        
        if (response.ok) {
          const student = await response.json()
          setFormData({
            hoTen: student.ho_ten || "", mssv: student.mssv || "", email: student.email || "",
            sdt: student.sdt || "", sdtZalo: student.sdt_zalo || "", tenHienThiZalo: student.ten_hien_thi_zalo || "",
            linkFacebook: student.link_facebook || "", tenHienThiFacebook: student.ten_hien_thi_facebook || "",
            namSinh: student.nam_sinh || "", congViec: student.cong_viec || "", kinhNghiem: student.kinh_nghiem || "",
            noiO: student.noi_o || "", soThich: student.so_thich || []
          })
        } else if (response.status === 404) {
          setStudentNotFound(true)
        } else {
          showToast("Không thể tải thông tin sinh viên. Vui lòng thử lại!", "error")
        }
      } catch (error) {
        console.error("Error loading student data:", error)
        showToast("Có lỗi kết nối. Vui lòng kiểm tra internet và thử lại!", "error")
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      loadStudentData()
    }
  }, [studentId]) // eslint-disable-line react-hooks/exhaustive-deps

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
      console.log("Submitting form data:", formData)
      console.log("Student ID:", studentId)
      
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log("Student updated:", result)
        
        const successMessage = `✅ Cập nhật thành công!\n\n🎉 Thông tin của ${formData.hoTen} đã được lưu:\n📋 MSSV: ${formData.mssv}\n📧 Email: ${formData.email}\n📱 Zalo: ${formData.sdtZalo}\n\n⏰ Đang quay lại danh sách lớp...`
        showToast(successMessage, "success")
        
        setIsRedirecting(true)
        setTimeout(() => {
          router.push('/student-list')
        }, 2000)
      } else {
        // Improved error handling
        let errorMessage = "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!"
        
        try {
          const errorResponse = await response.json()
          console.error("API Error Response:", errorResponse)
          
          if (errorResponse.error) {
            errorMessage = errorResponse.error
          } else if (errorResponse.message) {
            errorMessage = errorResponse.message
          }
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError)
          console.error("Response status:", response.status, "Response text:", await response.text())
          
          if (response.status === 404) {
            errorMessage = "Không tìm thấy sinh viên để cập nhật"
          } else if (response.status === 500) {
            errorMessage = "Lỗi server khi cập nhật thông tin"
          }
        }
        
        showToast(errorMessage, "error")
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

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Đang tải thông tin sinh viên...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Student not found state
  if (studentNotFound) {
    return (
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Không tìm thấy sinh viên</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Sinh viên với ID này không tồn tại trong hệ thống.</p>
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách lớp
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isFormValid = formData.hoTen && formData.mssv && formData.sdt && formData.sdtZalo && formData.tenHienThiZalo

  return (
    <>
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Chỉnh Sửa Thông Tin
          </CardTitle>
          <CardDescription className="text-base">
            Cập nhật thông tin cá nhân của bạn trong lớp VB2
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-orange-500" />
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
                      errors.hoTen ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
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
                      errors.mssv ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
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
                      errors.sdt ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                    }`}
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
                      errors.sdtZalo ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                    }`}
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
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
                  <Select value={formData.congViec} onValueChange={(value) => handleInputChange("congViec", value)}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500">
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
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
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-none"
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
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "hover:bg-orange-50 dark:hover:bg-orange-900/30"
                      }`}
                      onClick={() => handleSoThichToggle(soThich)}
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
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
              >
                {isRedirecting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang quay lại danh sách lớp...
                  </div>
                ) : isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật thông tin"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting || isRedirecting}
                className="w-full h-12 text-lg font-medium border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
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
