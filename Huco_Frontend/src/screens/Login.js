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
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

// Import Button component đã có
import MyButton from "../components/Button";

export default function Login({ navigation }) {
  // State quản lý focus của Input để đổi màu viền
  const [focusedInput, setFocusedInput] = useState(null);

  // State lưu giá trị nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.navigate("MainTabs");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* KeyboardAvoidingView giúp bàn phím không che mất Input khi nhập */}
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
                focusedInput === "email" && styles.inputFocused, // Đổi viền khi focus
              ]}
              placeholder="Email"
              placeholderTextColor="#626262"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Input Password */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "password" && styles.inputFocused,
              ]}
              placeholder="Mật khẩu"
              placeholderTextColor="#626262"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              value={password}
              onChangeText={setPassword}
              secureTextEntry // Che mật khẩu
            />

            {/* Quên mật khẩu */}
            <TouchableOpacity style={styles.forgotPassContainer}>
              <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Button Đăng nhập */}
            <View style={styles.loginButtonWrapper}>
              <MyButton
                title="Đăng nhập"
                variant="active"
                onPress={handleLogin}
              />
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
              {/* Google */}
              <TouchableOpacity style={styles.socialIconBtn}>
                <Ionicons name="logo-google" size={24} color="black" />
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity style={styles.socialIconBtn}>
                <FontAwesome5 name="facebook-f" size={24} color="black" />
              </TouchableOpacity>

              {/* Apple */}
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
    paddingTop: 60, // Khoảng cách từ trên xuống
    alignItems: "center",
  },

  // --- HEADER STYLES ---
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: "Montserrat-Bold", // Font Weight 700
    fontSize: 30,
    color: "#1F41BB",
    marginBottom: 20,
  },
  subHeaderContainer: {
    alignItems: "center",
  },
  subHeaderWelcome: {
    fontFamily: "Montserrat-SemiBold", // Font Weight 600
    fontSize: 20,
    color: "#000000",
    marginBottom: 5,
  },
  subHeaderAppName: {
    fontFamily: "Montserrat-Bold", // Font Weight 700 (hoặc 600 tùy file font)
    fontSize: 35,
    color: "#1F41BB",
  },

  // --- FORM STYLES ---
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    fontFamily: "Montserrat-Medium", // Font Weight 500
    fontSize: 16,
    height: 60,
    backgroundColor: "#F1F4FF", // Màu nền xám xanh nhạt
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20, // Gap giữa các input
    borderWidth: 2, // Độ dày viền mặc định (ẩn đi bằng màu trong suốt hoặc nền)
    borderColor: "transparent", // Mặc định không hiện viền
    color: "#000",
  },
  inputFocused: {
    borderColor: "#1F41BB", // Khi focus thì hiện viền xanh
    backgroundColor: "#F1F4FF",
  },
  forgotPassContainer: {
    alignSelf: "flex-end", // Căn phải
    marginBottom: 30,
  },
  forgotPassText: {
    fontFamily: "Montserrat-SemiBold", // Font Weight 600
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
    fontFamily: "Montserrat-SemiBold", // Font Weight 600
    fontSize: 14,
    color: "#494949",
    textAlign: "center",
  },

  // --- SOCIAL STYLES ---
  socialContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  socialText: {
    fontFamily: "Montserrat-SemiBold", // Font Weight 600
    fontSize: 14,
    color: "#1F41BB",
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10, // Khoảng cách giữa các nút icon
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
