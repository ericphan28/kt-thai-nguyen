import { createClient } from "../lib/supabase/client";
import students from "../data/students.json";

async function importStudents() {
  const supabase = createClient();

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
      console.error("Error importing student:", student.hoTen, error.message);
    } else {
      console.log("Imported:", student.hoTen);
    }
  }
}

importStudents();
