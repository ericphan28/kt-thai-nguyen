import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên",
  description: "Hệ thống quản lý thông tin sinh viên lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên",
  keywords: "kế toán, sinh viên, đại học thái nguyên, VB2 2025",
  authors: [{ name: "Thang Phan", url: "https://facebook.com/thang.phan.334" }],
  creator: "Thang Phan",
  openGraph: {
    title: "Lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên",
    description: "Hệ thống quản lý thông tin sinh viên lớp Kế Toán VB2 2025",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "Lớp Kế Toán VB2 2025 - Đại Học Thái Nguyên",
    description: "Hệ thống quản lý thông tin sinh viên lớp Kế Toán VB2 2025",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
