create table students (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid references auth.users(id) on delete set null,
  ho_ten text not null,
  mssv text,
  email text,
  sdt text,
  sdt_zalo text,
  ten_hien_thi_zalo text,
  link_facebook text,
  ten_hien_thi_facebook text,
  nam_sinh text,
  cong_viec text,
  kinh_nghiem text,
  noi_o text,
  so_thich text[], -- array of string
  created_at timestamp with time zone default now()
);

-- Tạo index để tìm kiếm nhanh theo email/sdt
create index students_email_idx on students(email);
create index students_sdt_idx on students(sdt);