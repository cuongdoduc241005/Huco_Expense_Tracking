import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Profile({ navigation, route }) {
  const userData = route.params?.user;

  // Quản lý Modal
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

  // State thông tin cá nhân
  const [name, setName] = useState(userData?.USER_NAME || "Cuong Do Duc");
  const [email, setEmail] = useState(
    userData?.USER_EMAIL || "doduccuong24102005@gmail.com"
  );
  const [avatar, setAvatar] = useState(null);

  // State mật khẩu với placeholder gợi ý
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
      </View>

      {/* --- PROFILE CARD (Đã bỏ nút chỉnh sửa trùng lặp) --- */}
      <View style={styles.profileCard}>
        <View style={styles.avatarShadow}>
          <Image
            source={avatar ? { uri: avatar } : require("../../assets/ava.jpg")}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.usernameText}>{name}</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      {/* --- MENU OPTIONS --- */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setEditModalVisible(true)}
        >
          <View style={styles.iconBox}>
            <Ionicons name="person-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuLabel}>Thông tin cá nhân</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setPasswordModalVisible(true)}
        >
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuLabel}>Bảo mật & Mật khẩu</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert("Thông báo", "Đang phát triển!")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="cloud-done-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuLabel}>Sao lưu Google Drive</Text>
          <Text style={styles.statusLabel}>Chưa kết nối</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => navigation.navigate("Login")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFEBEE" }]}>
            <MaterialIcons name="logout" size={22} color="#F44336" />
          </View>
          <Text style={[styles.menuLabel, { color: "#F44336" }]}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL CHỈNH SỬA HỒ SƠ --- */}
      <Modal visible={isEditModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>Chỉnh sửa hồ sơ</Text>
            <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
              <Image
                source={
                  avatar ? { uri: avatar } : require("../../assets/ava.jpg")
                }
                style={styles.modalAvatar}
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Họ và tên</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ tên mới"
            />
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Nhập email mới"
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.textCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSave}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.textSave}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      <Modal visible={isPasswordModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>Đổi mật khẩu</Text>
            {/* Đã thêm placeholder hiển thị chữ nhỏ trong ô nhập */}
            <TextInput
              style={styles.modalInput}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              onChangeText={setOldPassword}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Mật khẩu mới"
              secureTextEntry
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.textCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSave}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.textSave}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { padding: 20, alignItems: "center" },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "#1F41BB",
  },
  profileCard: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  avatarShadow: {
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  usernameText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    color: "#1F41BB",
    marginBottom: 5,
  },
  emailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#888",
    marginBottom: 15,
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 10,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#333",
  },
  statusLabel: {
    fontFamily: "Montserrat-Regular",
    color: "#888",
    fontSize: 12,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 25,
  },
  modalHeaderTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#1F41BB",
  },
  avatarPicker: { alignItems: "center", marginBottom: 20 },
  modalAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EEE",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#1F41BB",
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  modalLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    marginLeft: 5,
  },
  modalInput: {
    backgroundColor: "#F1F4FF",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 18,
    marginBottom: 18,
    fontFamily: "Montserrat-Medium",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 15,
  },
  btnCancel: { flex: 1, paddingVertical: 15, alignItems: "center" },
  btnSave: {
    flex: 1.5,
    backgroundColor: "#1F41BB",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  textSave: { color: "#FFF", fontFamily: "Montserrat-Bold", fontSize: 16 },
  textCancel: {
    color: "#999",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
});
