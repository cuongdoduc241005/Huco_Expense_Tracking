import { useState } from "react";
import AuthService from "../models/AuthService";

const useRegisterViewModel = (navigation) => {
  // --- STATE DỮ LIỆU ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- STATE UI ---
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- STATE CUSTOM ALERT ---
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
    onConfirm: () => {},
  });

  // Hàm Helper hiển thị thông báo
  const showAlert = (title, message, type = "success", onConfirm = null) => {
    setAlertConfig({
      title,
      message,
      type,
      onConfirm: onConfirm ? onConfirm : () => setAlertVisible(false),
    });
    setAlertVisible(true);
  };

  // --- LOGIC ĐĂNG KÝ ---
  const handleRegister = async () => {
    // 1. Kiểm tra rỗng
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      showAlert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ các trường!",
        "warning",
      );
      return;
    }

    // 2. Kiểm tra Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(
        "Email không hợp lệ",
        "Vui lòng nhập đúng định dạng (VD: abc@gmail.com)",
        "warning",
      );
      return;
    }

    // 3. Kiểm tra độ mạnh mật khẩu (Tối thiểu 8 ký tự, 1 chữ, 1 số)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      showAlert(
        "Mật khẩu yếu",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái và chữ số.",
        "warning",
      );
      return;
    }

    // 4. Kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      showAlert("Lỗi", "Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi qua AuthService
      const result = await AuthService.register(fullName, email, password);

      if (result.status === 201) {
        // Thành công -> Hiện thông báo xanh -> Bấm OK thì chuyển trang
        showAlert(
          "Thành công",
          "Tạo tài khoản thành công! Hãy đăng nhập ngay.",
          "success",
          () => {
            setAlertVisible(false);
            navigation.replace("Login");
          },
        );
      } else {
        showAlert(
          "Đăng ký thất bại",
          result.data.message || "Lỗi không xác định",
          "error",
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(
        "Lỗi kết nối",
        "Không thể kết nối Server. Vui lòng kiểm tra lại mạng.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.replace("Login");
  };

  // Trả về dữ liệu để View sử dụng
  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    focusedInput,
    setFocusedInput,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleRegister,
    handleLoginRedirect,
    // Custom Alert Props
    alertVisible,
    setAlertVisible,
    alertConfig,
  };
};

// QUAN TRỌNG: Xuất mặc định
export default useRegisterViewModel;
