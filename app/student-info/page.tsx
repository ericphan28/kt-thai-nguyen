import { StudentInfoForm } from "@/components/student-info-form"
import { StudentNavigation } from "@/components/student-navigation"

export default function StudentInfoPage() {
  return (
    <>
      <StudentNavigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Thông Tin Sinh Viên
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Tác giả: Thang Phan | Zalo: <a href="tel:0907136029" className="text-blue-600 hover:underline">0907136029</a> | Facebook: <a href="https://www.facebook.com/thang.phan.334" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">thang.phan.334</a>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <StudentInfoForm />
          </div>
        </div>
      </div>
    </>
  )
}
