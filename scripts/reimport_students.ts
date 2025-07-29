import { createClient } from '@supabase/supabase-js';
import students from "../data/students.json";

async function reimportStudents() {
  // Sử dụng publishable key thay vì service role key để tránh vấn đề env
  const supabase = createClient(
    'https://cktnodqbslzlgkgdwquj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdG5vZHFic2x6bGdrZ2R3cXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDQ4ODksImV4cCI6MjA2OTMyMDg4OX0.RPCI2vn-Gt5fYO_T_Qn3PzEXEwyg4uQBUSwBtccT6Sw'
  );

  console.log("🗑️ Đang xóa dữ liệu cũ...");
  // Xóa tất cả dữ liệu hiện tại
  const { error: deleteError } = await supabase
    .from("students")
    .delete()
    .neq('id', ''); // Xóa tất cả records

  if (deleteError) {
    console.error("Lỗi khi xóa dữ liệu cũ:", deleteError.message);
    return;
  }

  console.log("✅ Đã xóa dữ liệu cũ thành công");
  console.log(`📥 Đang import ${students.length} sinh viên...`);

  for (const student of students) {
    // Chuyển đổi từ camelCase sang snake_case để phù hợp với database schema
    const studentData = {
      ho_ten: student.hoTen,
      mssv: student.mssv,
      email: student.email,
      sdt: student.sdt,
      sdt_zalo: student.sdtZalo,
      ten_hien_thi_zalo: student.tenHienThiZalo,
      link_facebook: student.linkFacebook,
      ten_hien_thi_facebook: student.tenHienThiFacebook,
      nam_sinh: student.namSinh,
      cong_viec: student.congViec,
      kinh_nghiem: student.kinhNghiem,
      noi_o: student.noiO,
      so_thich: student.soThich || []
    };
    
    const { error } = await supabase.from("students").insert([studentData]);
    if (error) {
      console.error("❌ Lỗi khi import sinh viên:", student.hoTen, error.message);
    } else {
      console.log("✅ Đã import:", student.hoTen);
    }
  }

  console.log("🎉 Hoàn thành việc import lại dữ liệu!");
}

reimportStudents();
