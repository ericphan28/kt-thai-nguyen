# 🔄 Database Redesign & Auto Account Creation - Hướng dẫn triển khai

## 📋 Tổng quan thay đổi

### ✨ Tính năng mới
- **Tự động tạo tài khoản**: Khi sinh viên đăng ký thông tin, hệ thống tự động tạo tài khoản đăng nhập
- **Thiết kế database logic hơn**: Sử dụng snake_case, thêm constraints và indexes
- **Bảo mật tốt hơn**: Row Level Security (RLS), proper foreign keys
- **Trải nghiệm người dùng tốt hơn**: Hiển thị thông tin đăng nhập ngay sau khi đăng ký

### 🔧 Thay đổi kỹ thuật
- Database schema: từ camelCase → snake_case
- API endpoints: sử dụng Supabase function thay vì direct insert
- Frontend: cập nhật interface và property names
- Middleware: cho phép truy cập API không cần đăng nhập

---

## 🚀 Các bước triển khai

### Bước 1: Chạy Database Migration

**Option A: Sử dụng Supabase Dashboard (Khuyến nghị)**
1. Vào [Supabase Dashboard](https://supabase.com/dashboard) 
2. Chọn project → **SQL Editor**
3. Chạy các script theo thứ tự:

```sql
-- 1. Chạy nội dung file: scripts/sql/redesign-students-table.sql
-- Tạo lại bảng students với thiết kế mới, indexes, RLS policies

-- 2. Chạy nội dung file: scripts/sql/create-register-function.sql  
-- Tạo function register_student để tự động tạo tài khoản
```

**Option B: Sử dụng psql**
```bash
$env:PGPASSWORD = "YOUR_SUPABASE_PASSWORD"
psql --host=YOUR_HOST --port=6543 --username=postgres.YOUR_PROJECT --dbname=postgres --file=scripts/sql/redesign-students-table.sql
psql --host=YOUR_HOST --port=6543 --username=postgres.YOUR_PROJECT --dbname=postgres --file=scripts/sql/create-register-function.sql
```

### Bước 2: Verify Migration
Kiểm tra xem migration đã thành công:

```sql
-- Kiểm tra structure bảng students
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;

-- Kiểm tra function register_student
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'register_student';
```

### Bước 3: Test hệ thống
1. **Truy cập `/student-info`**
2. **Điền form đăng ký với thông tin thật**
3. **Submit và kiểm tra:**
   - Có hiển thị thông báo với thông tin đăng nhập?
   - Có tạo record trong bảng `students`?
   - Có tạo user trong `auth.users`?
4. **Test đăng nhập:**
   - Vào `/auth/login`
   - Dùng email và mật khẩu tạm thời để đăng nhập

---

## 🔍 Cấu trúc mới

### Database Schema
```sql
CREATE TABLE public.students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_uid uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Thông tin cơ bản (snake_case)  
    ho_ten text NOT NULL,
    mssv text UNIQUE,
    email text UNIQUE NOT NULL,
    sdt text UNIQUE NOT NULL,
    
    -- Thông tin liên lạc
    sdt_zalo text,
    ten_hien_thi_zalo text,
    link_facebook text, 
    ten_hien_thi_facebook text,
    
    -- Thông tin cá nhân
    nam_sinh text,
    cong_viec text,
    kinh_nghiem text,
    noi_o text,
    so_thich text[],
    
    -- Metadata
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

### API Flow mới
```
Frontend → POST /api/students → Supabase RPC register_student() → {
  1. Tạo user trong auth.users
  2. Tạo record trong students  
  3. Trả về thông tin đăng nhập
}
```

### Security Model
- **Public Read**: Mọi người có thể xem danh sách sinh viên
- **Owner Update**: Chỉ chủ tài khoản mới sửa được thông tin của mình
- **Cascade Delete**: Xóa user thì tự động xóa student record

---

## 🧪 Test Cases

### ✅ Test Registration
- [ ] Form validation hoạt động
- [ ] Tạo tài khoản thành công
- [ ] Hiển thị thông tin đăng nhập 
- [ ] Email/SĐT unique constraint
- [ ] Tạo record trong cả 2 bảng

### ✅ Test Login
- [ ] Đăng nhập bằng email + temp password
- [ ] Redirect về trang chính sau login
- [ ] Session được lưu đúng

### ✅ Test Data Display  
- [ ] Danh sách hiển thị đúng dữ liệu
- [ ] Search/filter hoạt động
- [ ] Links liên hệ hoạt động

---

## 🚨 Troubleshooting

### Lỗi thường gặp

**1. "Could not find column 'congViec'"**
- **Nguyên nhân**: Frontend vẫn dùng camelCase, database dùng snake_case
- **Giải pháp**: Đảm bảo đã cập nhật tất cả component sử dụng snake_case

**2. "Function register_student does not exist"**  
- **Nguyên nhân**: Chưa chạy migration hoặc không có quyền
- **Giải pháp**: Chạy lại script `create-register-function.sql` với service role key

**3. "RLS policy violation"**
- **Nguyên nhân**: Row Level Security chặn truy cập
- **Giải pháp**: Kiểm tra policies, đảm bảo có policy cho anon user

**4. "Network error / HTML response"**
- **Nguyên nhân**: API route bị lỗi, trả về error page thay vì JSON
- **Giải pháp**: Kiểm tra server logs, đảm bảo API trả về JSON cho mọi case

### Debug Commands
```sql
-- Kiểm tra user được tạo
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Kiểm tra student records  
SELECT * FROM public.students ORDER BY created_at DESC LIMIT 5;

-- Kiểm tra RLS policies
SELECT * FROM pg_policies WHERE tablename = 'students';
```

---

## 📁 Files Changed

### Database
- `scripts/sql/redesign-students-table.sql` - Schema mới
- `scripts/sql/create-register-function.sql` - Function tự động tạo account

### Backend  
- `app/api/students/route.ts` - API sử dụng register_student function
- `lib/supabase/middleware.ts` - Cho phép access API

### Frontend
- `components/student-info-form.tsx` - Hiển thị thông tin đăng nhập
- `components/student-list.tsx` - Cập nhật property names

### Documentation
- `scripts/MIGRATION_GUIDE.md` - Hướng dẫn migration
- `DEPLOYMENT_GUIDE.md` - File này

---

## 🎯 Next Steps (Optional)

1. **Password Reset Flow**: Cho phép sinh viên đổi mật khẩu
2. **Profile Management**: Cho phép sinh viên sửa thông tin cá nhân  
3. **Admin Panel**: Trang quản lý dành cho admin
4. **Email Notifications**: Gửi email chào mừng khi đăng ký
5. **Advanced Search**: Tìm kiếm theo nhiều tiêu chí hơn

---

## 💡 Notes

- **Mật khẩu tạm thời**: Có format `TempPass{4 số cuối SĐT}!` (ví dụ: `TempPass6029!`)
- **Login identifier**: Mặc định dùng email, có thể thay đổi thành SĐT
- **Data migration**: Dữ liệu cũ sẽ bị mất, cần import lại nếu cần thiêt
- **Security**: RLS được enable, cần cẩn thận khi thay đổi policies

🎉 **Chúc mừng! Hệ thống của bạn giờ đã có tính năng tự động tạo tài khoản cho sinh viên!**
