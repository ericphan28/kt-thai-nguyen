import { StudentEditForm } from "@/components/student-edit-form"
import { StudentNavigation } from "@/components/student-navigation"

export default async function StudentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <>
      <StudentNavigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Chỉnh Sửa Thông Tin
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>
          
          <div className="max-w-2xl mx-auto">
            <StudentEditForm studentId={id} />
          </div>
        </div>
      </div>
    </>
  )
}
