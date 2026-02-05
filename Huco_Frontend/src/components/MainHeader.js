import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";

export default function MainHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Xin chào,</Text>
        <Text style={styles.username}>Cuong Do Duc</Text>
      </View>
      <Image source={require("../../assets/ava.jpg")} style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#F9F9F9", // Đặt màu nền trùng background app để khi lướt không bị lộ
    zIndex: 10, // Đảm bảo luôn nổi lên trên
  },
  greeting: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#666",
  },
  username: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#1F41BB",
    marginTop: 2,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
});
