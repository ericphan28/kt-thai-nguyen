# 🔧 Cách khắc phục lỗi pgcrypto - Quick Fix

## ❌ Lỗi gặp phải
```
function gen_salt(unknown) does not exist
```

## ✅ Giải pháp đã áp dụng

**Thay đổi approach**: Thay vì tự động tạo tài khoản auth, chúng ta sẽ:
1. **Đăng ký thông tin sinh viên** → Lưu vào database
2. **Hiển thị thông tin đăng nhập đề xuất** → Sinh viên tự tạo account Supabase
3. **Khi sinh viên đăng nhập** → Hệ thống tự động link account với student record

## 🚀 Các bước triển khai

### 1. Chạy SQL Scripts đã cập nhật

**Vào Supabase Dashboard → SQL Editor, chạy:**

```sql
-- 1. Redesign bảng students (auth_uid có thể null)
-- Copy nội dung từ: scripts/sql/redesign-students-table.sql

-- 2. Function register_student đơn giản hóa  
-- Copy nội dung từ: scripts/sql/create-register-function.sql
```

### 2. Test flow mới

1. **Đăng ký thông tin**: `/student-info`
   - Điền form → Submit
   - Nhận thông báo với email và mật khẩu đề xuất

2. **Tạo tài khoản**: `/auth/sign-up` 
   - Dùng email và mật khẩu được đề xuất
   - Hoặc dùng email riêng + mật khẩu tự chọn

3. **Đăng nhập**: `/auth/login`
   - Dùng thông tin vừa tạo
   - Hệ thống sẽ tự động link với student record

## 🎯 Ưu điểm của approach mới

- ✅ **Không cần pgcrypto extension**
- ✅ **Tuân thủ Supabase auth flow**  
- ✅ **Linh hoạt hơn** - sinh viên có thể dùng mật khẩu riêng
- ✅ **Bảo mật tốt hơn** - không tạo tài khoản với mật khẩu yếu

## 📝 User Experience

```
1. Sinh viên đăng ký thông tin
   ↓
2. Hiển thị: "Đăng ký thành công! Để đăng nhập, hãy tạo tài khoản với email: xxx@gmail.com"
   ↓  
3. Sinh viên vào /auth/sign-up tạo tài khoản
   ↓
4. Đăng nhập và sử dụng hệ thống
```

## ⚡ Thay đổi trong code

- **Database**: `auth_uid` có thể null
- **Function**: Chỉ insert vào `students`, không tạo auth user
- **Frontend**: Hướng dẫn sinh viên tạo tài khoản thủ công
- **Message**: Rõ ràng hơn về các bước tiếp theo

---

**Tóm lại**: Approach mới đơn giản, ổn định và tuân thủ best practices của Supabase! 🚀
