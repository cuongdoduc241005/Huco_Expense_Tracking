import { useState } from "react";
import { Alert } from "react-native";
// 👇 SỬA DÒNG NÀY: Bỏ dấu ngoặc nhọn { }
import AuthService from "../models/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLoginViewModel = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setIsLoading(true);

    try {
      console.log(">>> [ViewModel] Bắt đầu gọi AuthService...");

      // Kiểm tra xem AuthService có tồn tại không trước khi gọi
      if (!AuthService) {
        throw new Error("AuthService đang bị undefined (Lỗi Import)");
      }

      const result = await AuthService.login(email, password);

      if (result.status === 200) {
        console.log(">>> [ViewModel] Login OK:", result.data.user);
        try {
          await AsyncStorage.setItem("user", JSON.stringify(result.data.user));
        } catch (e) {
          console.error("Lỗi lưu user:", e);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        Alert.alert(
          "Đăng nhập thất bại",
          result.data.message || "Sai thông tin.",
        );
      }
    } catch (error) {
      console.error(">>> [ViewModel] Lỗi CATCH:", error);
      Alert.alert("Lỗi", "Không thể kết nối Server. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    focusedInput,
    setFocusedInput,
    handleLogin,
    isPasswordVisible,
    setIsPasswordVisible,
  };
};
