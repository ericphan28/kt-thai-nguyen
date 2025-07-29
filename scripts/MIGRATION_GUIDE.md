# Hướng dẫn chạy migration manually

Vì Supabase không có function `exec_sql` by default, bạn cần chạy SQL scripts thủ công:

## Cách 1: Sử dụng Supabase Dashboard

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy và paste nội dung từ các file SQL sau theo thứ tự:

### Bước 1: Chạy redesign-students-table.sql
```sql
-- Copy toàn bộ nội dung từ scripts/sql/redesign-students-table.sql
```

### Bước 2: Chạy create-register-function.sql
```sql
-- Copy toàn bộ nội dung từ scripts/sql/create-register-function.sql
```

## Cách 2: Sử dụng psql command line

```bash
# Set environment variable
$env:PGPASSWORD = "YOUR_SUPABASE_PASSWORD"

# Run redesign table script
psql --host=YOUR_SUPABASE_HOST --port=6543 --username=postgres.YOUR_PROJECT --dbname=postgres --file=scripts/sql/redesign-students-table.sql

# Run register function script  
psql --host=YOUR_SUPABASE_HOST --port=6543 --username=postgres.YOUR_PROJECT --dbname=postgres --file=scripts/sql/create-register-function.sql
```

## Cách 3: Sử dụng Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push

# Or run individual SQL files
supabase db reset --db-url "postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres"
```

## Verify Migration

Sau khi chạy migration, kiểm tra:

1. **Bảng students mới**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'students' 
   ORDER BY ordinal_position;
   ```

2. **Function register_student**:
   ```sql
   SELECT routine_name, routine_type 
   FROM information_schema.routines 
   WHERE routine_name = 'register_student';
   ```

3. **Test registration**:
   - Truy cập `/student-info`
   - Điền form và submit
   - Kiểm tra xem có tạo tài khoản auth và bản ghi student không

## Troubleshooting

- Nếu gặp lỗi permission: Đảm bảo sử dụng service role key
- Nếu gặp lỗi syntax: Kiểm tra lại PostgreSQL version compatibility
- Nếu function không chạy: Kiểm tra SECURITY DEFINER và schema permissions
