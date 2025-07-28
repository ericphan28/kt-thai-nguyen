import { StudentList } from "@/components/student-list"
import { StudentNavigation } from "@/components/student-navigation"

export default function StudentListPage() {
  return (
    <>
      <StudentNavigation />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Danh Sách Lớp Kế Toán VB2 2025
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Đại Học Thái Nguyên
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full" />
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Tác giả: Thang Phan | Zalo: <a href="tel:0907136029" className="text-blue-600 hover:underline">0907136029</a> | Facebook: <a href="https://www.facebook.com/thang.phan.334" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">thang.phan.334</a>
            </div>
          </div>
          
          <StudentList />
        </div>
      </div>
    </>
  )
}
