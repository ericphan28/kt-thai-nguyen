-- Script SQL để thêm unique constraint cho MSSV
-- Copy trực tiếp vào database

-- Thêm unique constraint cho mssv
ALTER TABLE students ADD CONSTRAINT students_mssv_unique UNIQUE (mssv);

-- Thêm index để tìm kiếm nhanh theo MSSV  
CREATE INDEX IF NOT EXISTS students_mssv_idx ON students(mssv);

-- Thêm check constraint: MSSV phải có ít nhất 5 ký tự
ALTER TABLE students ADD CONSTRAINT students_mssv_format_check 
CHECK (LENGTH(mssv) >= 5);

-- Comment giải thích
COMMENT ON COLUMN students.mssv IS 'Mã số sinh viên - yêu cầu ít nhất 5 ký tự';
