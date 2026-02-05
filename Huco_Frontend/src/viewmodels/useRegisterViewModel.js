import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Fix lỗi SafeAreaView cũ
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

// Components & ViewModel
import MyButton from "../components/Button";
import CustomAlert from "../components/CustomAlert"; // Import Alert đẹp
import { useRegisterViewModel } from "../viewmodels/useRegisterViewModel";

export default function Register({ navigation }) {
  // Kết nối ViewModel
  const {
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
    // Custom Alert
    alertVisible,
    setAlertVisible,
    alertConfig,
  } = useRegisterViewModel(navigation);

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
            <View
              style={[
                styles.passwordWrapper,
                focusedInput === "password" && styles.inputFocused, // Hiệu ứng focus cho cả khung
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  styles.inputNoMargin,
                  { flex: 1, borderWidth: 0, height: "100%" }, // Fix style để input full chiều cao
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
            <View
              style={[
                styles.passwordWrapper,
                focusedInput === "confirm" && styles.inputFocused,
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  styles.inputNoMargin,
                  { flex: 1, borderWidth: 0, height: "100%" },
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

      {/* --- CUSTOM ALERT --- */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onCancel={() => setAlertVisible(false)}
        onConfirm={alertConfig.onConfirm}
      />
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
  inputNoMargin: { marginBottom: 0, paddingHorizontal: 15 },
  inputFocused: { borderColor: "#1F41BB", backgroundColor: "#F1F4FF" },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    height: 60, // Fix chiều cao cố định để không bị lệch
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
