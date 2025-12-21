import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Profile({ navigation }) {
  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        // Khi đăng xuất, quay về màn hình Login gốc (nằm ngoài Tab Navigator)
        onPress: () => navigation.navigate("Login"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />

      {/* HEADER PROFILE */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
      </View>

      <View style={styles.profileCard}>
        <Image source={require("../../assets/ava.jpg")} style={styles.avatar} />
        <Text style={styles.username}>Cuong Do Duc</Text>
        <Text style={styles.email}>cuong.d@example.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      </View>

      {/* MENU OPTIONS */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Ionicons name="settings-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuText}>Cài đặt chung</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuText}>Bảo mật & Mật khẩu</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
          </View>
          <Text style={styles.menuText}>Thông báo</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.iconBox, { backgroundColor: "#FFEBEE" }]}>
            <MaterialIcons name="logout" size={22} color="#F44336" />
          </View>
          <Text style={[styles.menuText, { color: "#F44336" }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { padding: 20, alignItems: "center" },
  headerTitle: { fontFamily: "Montserrat-Bold", fontSize: 18, color: "#333" },

  profileCard: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  username: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  editBtn: {
    backgroundColor: "#1F41BB",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editBtnText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#FFF",
  },

  menuContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#333",
  },
});
