import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * Button Component chuẩn Figma
 * @param {string} title - Nội dung chữ
 * @param {string} variant - Tên biến thể: 'active' | 'small active' | 'small' | 'Default'

 */

export default function MyButton({ title, onPress, variant = "Default" }) {
  // 1. Logic kiểm tra kích thước
  const isSmall = variant.toLowerCase().includes("small");

  // 2. Logic kiểm tra màu sắc (Active là Xanh, còn lại là Trắng)
  const isActive = variant.toLowerCase().includes("active");
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSmall ? styles.sizeSmall : styles.sizeLarge,
        isActive ? styles.bgActive : styles.bgDefault,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.textBase,

          isSmall ? styles.textSizeSmall : styles.textSizeLarge,
          isActive ? styles.textActive : styles.textDefault,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // --- Style CHUNG ---
  container: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },

  textBase: {
    // fontWeight: "600",
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },

  // --- KÍCH THƯỚC ---
  sizeLarge: {
    height: 54,
  },

  sizeSmall: {
    height: 44,
    width: "48%",
    alignSelf: "center",
  },

  textSizeLarge: {
    fontSize: 20,
  },

  textSizeSmall: {
    fontSize: 14,
  },

  // --- MÀU SẮC & ĐỔ BÓNG ---
  // 1. Variant 'active' (Nút Xanh - Có bóng đổ chuẩn Figma)
  bgActive: {
    backgroundColor: "#1F41BB", // Màu nền xanh đậm
    borderWidth: 0,

    // --- CẤU HÌNH BÓNG ĐỔ (Drop Shadow) ---

    shadowColor: "#CBD6FF", // Màu bóng xanh nhạt
    shadowOffset: { width: 0, height: 10 }, // Y = 10
    shadowOpacity: 1, // Opacity = 100%
    shadowRadius: 20, // Blur = 20
    elevation: 20, // Độ nổi cho Android (để tương xứng với Y=10)
  },

  textActive: {
    color: "#FFFFFF",
  },

  // 2. Variant 'Default' (Nút Trắng - Phẳng, không bóng)
  bgDefault: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "#1F41BB",
    elevation: 0, // Tắt bóng
  },

  textDefault: {
    color: "#0A0A0A",
  },
});
