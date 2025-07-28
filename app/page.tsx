import { StudentNavigation } from "@/components/student-navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, GraduationCap, ArrowRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <>
      <StudentNavigation />
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
            {/* Hero Section for VB2 Class */}
            <div className="text-center space-y-6 pt-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Chào mừng đến với Lớp VB2
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Hệ thống quản lý thông tin sinh viên để tăng cường giao lưu và học tập
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Đăng Ký Thông Tin
                  </CardTitle>
                  <CardDescription className="text-base">
                    Điền thông tin cá nhân để tham gia vào cộng đồng lớp VB2
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 group-hover:scale-105">
                    <Link href="/student-info" className="flex items-center justify-center gap-2">
                      Bắt đầu đăng ký
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Danh Sách Lớp
                  </CardTitle>
                  <CardDescription className="text-base">
                    Xem thông tin các bạn trong lớp và tìm kiếm bạn học
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 group-hover:scale-105">
                    <Link href="/student-list" className="flex items-center justify-center gap-2">
                      Xem danh sách
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

         </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
            <div className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-400">              
              <span>Zalo: <a href="tel:0907136029" className="text-blue-600 hover:underline">0907136029</a></span>
              <span>Facebook: <a href="https://www.facebook.com/thang.phan.334" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Thang Phan</a></span>
            </div>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    </>
  );
}
