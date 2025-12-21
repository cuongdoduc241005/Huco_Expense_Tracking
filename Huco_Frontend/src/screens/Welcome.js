import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";

// Import component Button
import MyButton from "../components/Button";

const { width } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };
  const handleSkip = () => console.log("Skipped intro...");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER: NÚT BỎ QUA */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      {/* HÌNH ẢNH MINH HỌA */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/welcome.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* NỘI DUNG TEXT */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Chào mừng bạn{"\n"}đến với Huco!</Text>

        <Text style={styles.description}>
          Trợ thủ giúp bạn quản lý tài chính cá nhân một cách đơn giản và hiệu
          quả. Hãy bắt đầu theo dõi thu nhập và xây dựng thói quen tài chính
          thông minh ngay hôm nay.
        </Text>
      </View>

      {/* KHU VỰC NÚT BẤM */}
      <View style={styles.buttonContainer}>
        <MyButton title="Đăng nhập" variant="active" onPress={handleLogin} />
        <MyButton title="Đăng ký" variant="Default" onPress={handleRegister} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
  },
  header: {
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 10,
    alignItems: "flex-end",
    zIndex: 10,
  },
  skipText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#000000",
  },
  imageContainer: {
    flex: 4,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: width * 0.85,
    height: width * 0.85,
  },
  contentContainer: {
    flex: 2.5,
    alignItems: "center",
    paddingHorizontal: 35,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 35,
    lineHeight: 43,
    color: "#1F41BB",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    flex: 2.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
});

export default Welcome;
