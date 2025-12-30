import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

// Import component Button chuẩn Figma đã có của bạn
import MyButton from "../components/Button";

export default function Register({ navigation }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State lưu giá trị nhập theo cấu trúc server mới
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // 1. Kiểm tra không để trống
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // 2. Kiểm tra định dạng Email (Regex chuẩn)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi định dạng", "Email không hợp lệ (ví dụ: abc@gmail.com)");
      return;
    }

    // 3. Kiểm tra độ dài và độ phức tạp mật khẩu
    // Tối thiểu 8 ký tự, ít nhất 1 chữ cái và 1 chữ số
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Mật khẩu yếu",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái và chữ số."
      );
      return;
    }

    // 4. Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.100.145:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: fullName,
          email: email,
          password: password,
        }),
      });

      if (response.status === 201) {
        // Thành công -> Chuyển trang ngay lập tức
        navigation.replace("Login");
      } else {
        const data = await response.json();
        Alert.alert("Thất bại", data.message || "Không thể đăng ký.");
      }
    } catch (error) {
      Alert.alert("Lỗi kết nối", "Vui lòng kiểm tra Wi-Fi hoặc Server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.replace("Login"); // Quay lại trang Login
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HEADER --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Tạo tài khoản</Text>
            <Text style={styles.subHeader}>
              Hãy tạo tài khoản để quản lý chi tiêu của bạn!
            </Text>
          </View>

          {/* --- FORM INPUT --- */}
          <View style={styles.formContainer}>
            {/* Input Họ và tên */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "fullName" && styles.inputFocused,
              ]}
              placeholder="Tên người dùng"
              placeholderTextColor="#626262"
              onFocus={() => setFocusedInput("fullName")}
              onBlur={() => setFocusedInput(null)}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            {/* Input Email */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "email" && styles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor="#626262"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Input Mật khẩu */}
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputNoMargin,
                  { flex: 1, borderWidth: 0 },
                ]}
                placeholder="Mật khẩu"
                placeholderTextColor="#626262"
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#626262"
                />
              </TouchableOpacity>
            </View>

            {/* Input Xác nhận mật khẩu */}
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputNoMargin,
                  { flex: 1, borderWidth: 0 },
                ]}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#626262"
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setFocusedInput("confirm")}
                onBlur={() => setFocusedInput(null)}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#626262"
                />
              </TouchableOpacity>
            </View>

            {/* Button Đăng ký / Loading Indicator */}
            <View style={styles.registerButtonWrapper}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#1F41BB" />
              ) : (
                <MyButton
                  title="Đăng ký"
                  variant="active"
                  onPress={handleRegister}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.loginRedirectBtn}
              onPress={handleLoginRedirect}
            >
              <Text style={styles.loginRedirectText}>Bạn đã có tài khoản?</Text>
            </TouchableOpacity>
          </View>

          {/* --- SOCIAL MEDIA --- */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Hoặc tiếp tục với</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialIconBtn}>
                <Ionicons name="logo-google" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBtn}>
                <FontAwesome5 name="facebook-f" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBtn}>
                <Ionicons name="logo-apple" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 35,
    paddingTop: "12%",
    alignItems: "center",
  },
  headerContainer: { alignItems: "center", marginBottom: 40, width: "100%" },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
    color: "#1F41BB",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    width: 326,
  },
  formContainer: { width: "100%", maxWidth: 357 },
  input: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    height: 60,
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    color: "#000",
  },
  inputNoMargin: { marginBottom: 0 },
  inputFocused: { borderColor: "#1F41BB", backgroundColor: "#F1F4FF" },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  eyeBtn: { paddingRight: 15 },
  registerButtonWrapper: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  loginRedirectBtn: { padding: 10, alignItems: "center" },
  loginRedirectText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#494949",
  },
  socialContainer: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  socialText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#1F41BB",
    marginBottom: 20,
  },
  socialRow: { flexDirection: "row", gap: 15 },
  socialIconBtn: {
    width: 60,
    height: 44,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
