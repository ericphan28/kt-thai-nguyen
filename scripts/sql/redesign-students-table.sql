-- Xóa bảng cũ và tạo lại với thiết kế mới
DROP TABLE IF EXISTS public.students CASCADE;

-- Tạo bảng students mới với thiết kế logic hơn
CREATE TABLE public.students (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    auth_uid uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Có thể null khi chưa tạo account
    
    -- Thông tin cơ bản
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
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tạo indexes cho hiệu suất
CREATE INDEX students_email_idx ON public.students USING btree (email);
CREATE INDEX students_sdt_idx ON public.students USING btree (sdt);
CREATE INDEX students_mssv_idx ON public.students USING btree (mssv);
CREATE INDEX students_auth_uid_idx ON public.students USING btree (auth_uid);

-- Tạo trigger tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo RLS policies (Row Level Security)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policy: Mọi người có thể đọc thông tin sinh viên (public read)
CREATE POLICY "Public can view students" ON public.students
    FOR SELECT USING (true);

-- Policy: Cho phép insert cho anonymous users (khi đăng ký)
CREATE POLICY "Allow insert for registration" ON public.students
    FOR INSERT WITH CHECK (true);

-- Policy: Chỉ chủ tài khoản mới có thể sửa thông tin của mình (sau khi đã link account)
CREATE POLICY "Users can update own profile" ON public.students
    FOR UPDATE USING (auth.uid() = auth_uid);

-- Policy: Admin có thể làm tất cả (optional - có thể bỏ nếu không cần)
-- CREATE POLICY "Admin can do everything" ON public.students
--     USING (auth.jwt() ->> 'role' = 'admin');
