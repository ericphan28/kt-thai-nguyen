// Validation utilities for student form
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email là bắt buộc"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Email không hợp lệ"
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Số điện thoại là bắt buộc"
  // Vietnamese phone number regex
  const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return "Số điện thoại không hợp lệ (VD: 0901234567)"
  }
  return null
}

export const validateMSSV = (mssv: string): string | null => {
  if (!mssv) return "MSSV là bắt buộc"
  
  // Remove spaces for validation
  const cleanMSSV = mssv.trim()
  
  // Chỉ kiểm tra độ dài tối thiểu
  if (cleanMSSV.length < 5) {
    return "MSSV phải có ít nhất 5 ký tự"
  }
  
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) return "Họ tên là bắt buộc"
  if (name.length < 2) return "Họ tên quá ngắn"
  if (name.length > 50) return "Họ tên quá dài"
  // Check for valid Vietnamese name characters
  const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹżẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/
  if (!nameRegex.test(name)) {
    return "Họ tên chỉ được chứa chữ cái và khoảng trắng"
  }
  return null
}

// Boolean version for API use
export const validateMSSVBoolean = (mssv: string): boolean => {
  if (!mssv) return false
  const cleanMSSV = mssv.trim()
  return cleanMSSV.length >= 5
}

export const validateFacebookUrl = (url: string): string | null => {
  if (!url) return null // Facebook is optional
  const fbRegex = /^https?:\/\/(www\.)?(facebook|fb)\.com\/[a-zA-Z0-9.]+\/?$/
  if (!fbRegex.test(url)) {
    return "Link Facebook không hợp lệ (VD: https://facebook.com/yourname)"
  }
  return null
}

export const validateBirthYear = (year: string): string | null => {
  if (!year) return null // Birth year is optional
  const yearNum = parseInt(year)
  const currentYear = new Date().getFullYear()
  if (yearNum < 1960 || yearNum > currentYear) {
    return `Năm sinh phải từ 1960 đến ${currentYear}`
  }
  return null
}
