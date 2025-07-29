# 🔍 Debug API Issues - Step by Step

## 1. Kiểm tra API endpoint

Mở browser console và chạy:

```javascript
// Test GET API
fetch('/api/students')
  .then(r => r.json())
  .then(d => console.log('GET result:', d))
  .catch(e => console.error('GET error:', e));

// Test POST API với data đơn giản
fetch('/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hoTen: "Test User",
    mssv: "123456789",
    email: "test@example.com", 
    sdt: "0123456789",
    sdtZalo: "0123456789",
    tenHienThiZalo: "Test",
    linkFacebook: "",
    tenHienThiFacebook: "",
    namSinh: "2000",
    congViec: "Sinh viên",
    kinhNghiem: "",
    noiO: "Hà Nội",
    soThich: ["Đọc sách"]
  })
})
.then(r => r.json())
.then(d => console.log('POST result:', d))
.catch(e => console.error('POST error:', e));
```

## 2. Nếu API trả về lỗi

**Bước 1: Kiểm tra xem đã chạy SQL scripts chưa**

Vào Supabase Dashboard → SQL Editor → Chạy query:

```sql
-- Kiểm tra table có tồn tại không
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'students';

-- Kiểm tra function có tồn tại không  
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'register_student';

-- Kiểm tra structure của table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;
```

**Bước 2: Nếu chưa có table/function**

Chạy 2 SQL scripts theo thứ tự:

1. Copy toàn bộ nội dung `scripts/sql/redesign-students-table.sql` → Paste vào SQL Editor → Run
2. Copy toàn bộ nội dung `scripts/sql/create-register-function.sql` → Paste vào SQL Editor → Run

**Bước 3: Test function trực tiếp trong Supabase**

```sql
-- Test function trong SQL Editor
SELECT public.register_student(
  '{"ho_ten": "Test User", "email": "test@example.com", "sdt": "0123456789", "mssv": "123456789", "sdt_zalo": "0123456789", "ten_hien_thi_zalo": "Test", "nam_sinh": "2000", "cong_viec": "Sinh viên", "noi_o": "Hà Nội", "so_thich": ["Đọc sách"]}'::jsonb,
  true
);
```

## 3. Nếu vẫn lỗi, kiểm tra environment variables

Đảm bảo trong `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Temporary workaround

Nếu function vẫn không hoạt động, tạm thời sử dụng insert trực tiếp:

```typescript
// Trong app/api/students/route.ts
const { data, error } = await supabase
  .from('students')
  .insert([studentData])
  .select()
```

## 5. Common Issues

- **RLS Policy**: Đảm bảo có policy cho INSERT
- **Missing columns**: Kiểm tra tên cột snake_case vs camelCase  
- **Function permissions**: Đảm bảo GRANT EXECUTE cho anon
- **Environment**: Kiểm tra Supabase URL và keys

---

**Chú ý**: Chạy từng bước và kiểm tra kết quả trước khi chuyển bước tiếp theo!
