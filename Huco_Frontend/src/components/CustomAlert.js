import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CustomAlert = ({
  visible,
  title,
  message,
  type = "info",
  onCancel,
  onConfirm,
}) => {
  // Cấu hình màu sắc và icon dựa trên loại thông báo
  const config = {
    success: {
      color: "#4CAF50",
      icon: "checkmark-circle",
      btnLabel: "Tuyệt vời",
    },
    error: { color: "#F44336", icon: "alert-circle", btnLabel: "Đóng" },
    warning: { color: "#FF9800", icon: "warning", btnLabel: "Đã hiểu" },
    confirm: { color: "#1F41BB", icon: "help-circle", btnLabel: "Đồng ý" }, // Loại hỏi xác nhận
  };

  const currentConfig = config[type] || config.success;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* Icon Header */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: currentConfig.color + "20" },
            ]}
          >
            <Ionicons
              name={currentConfig.icon}
              size={32}
              color={currentConfig.color}
            />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {/* Nếu là loại CONFIRM thì hiện nút Hủy */}
            {type === "confirm" && (
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={onCancel}
              >
                <Text style={styles.btnCancelText}>Hủy bỏ</Text>
              </TouchableOpacity>
            )}

            {/* Nút chính */}
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnConfirm,
                { backgroundColor: currentConfig.color },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.btnConfirmText}>
                {type === "confirm" ? "Xác nhận" : currentConfig.btnLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  btnRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancel: {
    backgroundColor: "#F5F5F5",
  },
  btnConfirm: {
    elevation: 3,
  },
  btnCancelText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#777",
    fontSize: 15,
  },
  btnConfirmText: {
    fontFamily: "Montserrat-Bold",
    color: "white",
    fontSize: 15,
  },
});
