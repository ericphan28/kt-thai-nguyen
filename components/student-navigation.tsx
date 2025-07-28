"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Home, GraduationCap } from "lucide-react"

const navigation = [
  {
    name: "Trang chủ",
    href: "/",
    icon: Home
  },
  {
    name: "Đăng ký thông tin",
    href: "/student-info", 
    icon: UserPlus
  },
  {
    name: "Danh sách lớp",
    href: "/student-list",
    icon: Users
  }
]

export function StudentNavigation() {
  const pathname = usePathname()

  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kế Toán VB2 2025
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Đại Học Thái Nguyên
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Class Info Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
              <Users className="w-3 h-3 mr-1" />
              Kế Toán VB2 2025
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  )
}
