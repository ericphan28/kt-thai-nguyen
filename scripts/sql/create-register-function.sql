-- Tạo hàm để tự động đăng ký sinh viên (auth user sẽ được tạo ở API level)
CREATE OR REPLACE FUNCTION public.register_student(
    student_data jsonb,
    use_email_login boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_student_id uuid;
    login_identifier text;
    temp_password text;
    result jsonb;
BEGIN
    -- Xác định login identifier (email hoặc sdt)
    IF use_email_login THEN
        login_identifier := student_data->>'email';
    ELSE
        login_identifier := student_data->>'sdt';
    END IF;
    
    -- Tạo mật khẩu tạm thời = số điện thoại (dễ nhớ)
    temp_password := student_data->>'sdt';
    
    -- Tạo bản ghi trong bảng students
    INSERT INTO public.students (
        ho_ten,
        mssv,
        email,
        sdt,
        sdt_zalo,
        ten_hien_thi_zalo,
        link_facebook,
        ten_hien_thi_facebook,
        nam_sinh,
        cong_viec,
        kinh_nghiem,
        noi_o,
        so_thich
    ) VALUES (
        student_data->>'ho_ten',
        student_data->>'mssv',
        student_data->>'email',
        student_data->>'sdt',
        student_data->>'sdt_zalo',
        student_data->>'ten_hien_thi_zalo',
        student_data->>'link_facebook',
        student_data->>'ten_hien_thi_facebook',
        student_data->>'nam_sinh',
        student_data->>'cong_viec',
        student_data->>'kinh_nghiem',
        student_data->>'noi_o',
        ARRAY(SELECT jsonb_array_elements_text(student_data->'so_thich'))
    ) RETURNING id INTO new_student_id;
    
    -- Trả về kết quả
    result := jsonb_build_object(
        'success', true,
        'student_id', new_student_id,
        'login_identifier', login_identifier,
        'temp_password', temp_password,
        'message', 'Đăng ký thông tin thành công!'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Email, SĐT hoặc MSSV đã tồn tại',
            'message', 'Thông tin này đã được đăng ký trước đó'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Có lỗi xảy ra khi đăng ký'
        );
END;
$$;
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Email, SĐT hoặc MSSV đã tồn tại',
            'message', 'Thông tin này đã được đăng ký trước đó'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Có lỗi xảy ra khi đăng ký'
        );
END;
$$;
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Email, SĐT hoặc MSSV đã tồn tại',
            'message', 'Thông tin này đã được đăng ký trước đó'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Có lỗi xảy ra khi đăng ký'
        );
END;
$$;

-- Cấp quyền thực thi cho anonymous (để có thể đăng ký không cần login)
GRANT EXECUTE ON FUNCTION public.register_student(jsonb, boolean) TO anon;
GRANT EXECUTE ON FUNCTION public.register_student(jsonb, boolean) TO authenticated;
