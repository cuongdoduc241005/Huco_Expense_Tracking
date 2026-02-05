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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

// Import Components & ViewModel
import MyButton from "../components/Button";
import { useLoginViewModel } from "../viewmodels/useLoginViewModel";

export default function Login({ navigation }) {
  // Kết nối với ViewModel
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    focusedInput,
    setFocusedInput,
    handleLogin,
    // State mới
    isPasswordVisible,
    setIsPasswordVisible,
  } = useLoginViewModel(navigation);

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
            <Text style={styles.headerTitle}>Đăng nhập</Text>
            <View style={styles.subHeaderContainer}>
              <Text style={styles.subHeaderWelcome}>Chào mừng bạn đến với</Text>
              <Text style={styles.subHeaderAppName}>Huco!</Text>
            </View>
          </View>

          {/* --- FORM INPUT --- */}
          <View style={styles.formContainer}>
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

            {/* --- INPUT PASSWORD (CÓ NÚT MẮT) --- */}
            <View
              style={[
                styles.passwordContainer,
                focusedInput === "password" && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Mật khẩu"
                placeholderTextColor="#626262"
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                value={password}
                onChangeText={setPassword}
                // Logic ẩn hiện: nếu isPasswordVisible=true thì secure=false
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="#626262"
                />
              </TouchableOpacity>
            </View>

            {/* Quên mật khẩu */}
            <TouchableOpacity style={styles.forgotPassContainer}>
              <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Button Đăng nhập */}
            <View style={styles.loginButtonWrapper}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#1F41BB" />
              ) : (
                <MyButton
                  title="Đăng nhập"
                  variant="active"
                  onPress={handleLogin}
                />
              )}
            </View>

            {/* Tạo tài khoản mới */}
            <TouchableOpacity
              style={styles.createAccountBtn}
              onPress={() => navigation.replace("Register")}
            >
              <Text style={styles.createAccountText}>Tạo tài khoản mới</Text>
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
                <FontAwesome5 name="facebook-f" size={24} color="black" />
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
    color: "#1F41BB",
    marginBottom: 20,
  },
  subHeaderContainer: {
    alignItems: "center",
  },
  subHeaderWelcome: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "#000000",
    marginBottom: 5,
  },
  subHeaderAppName: {
    fontFamily: "Montserrat-Bold",
    fontSize: 35,
    color: "#1F41BB",
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
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
  // --- STYLE MỚI CHO PASSWORD ---
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: "#F1F4FF",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  // -----------------------------
  inputFocused: {
    borderColor: "#1F41BB",
    backgroundColor: "#F1F4FF",
  },
  forgotPassContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPassText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#1F41BB",
  },
  loginButtonWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  createAccountBtn: {
    padding: 10,
    alignItems: "center",
  },
  createAccountText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#494949",
    textAlign: "center",
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  socialText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#1F41BB",
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialIconBtn: {
    width: 60,
    height: 44,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
