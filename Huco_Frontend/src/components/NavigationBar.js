import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const NavigationBar = ({ activeTab = "Home", onTabPress }) => {
  // Logic màu sắc giữ nguyên: Chọn thì Xanh, không chọn thì Xám
  const getColor = (tabName) => (activeTab === tabName ? "#1F41BB" : "#A2A2A2");

  // --- CẬP NHẬT LOGIC FONT ---
  // Chỉ khi là tab 'Home' và đang active thì mới dùng SemiBold
  // Các tab khác luôn là Medium
  const getFontFamily = (tabName) => {
    if (tabName === "Home" && activeTab === "Home") {
      return "Montserrat-SemiBold";
    }
    return "Montserrat-Medium";
  };
  // ---------------------------

  // --- LOGIC ANIMATION QUÉT (LASER) ---
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Chạy vòng lặp animation: Xuống -> Lên -> Xuống...
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1500, // 1.5 giây đi xuống
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1500, // 1.5 giây đi lên
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  // Biến đổi giá trị 0-1 thành toạ độ Y (từ -14 đến 14px)
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-14, 14],
  });
  // ------------------------------------

  return (
    <View style={styles.container}>
      {/* Background Bar */}
      <View style={styles.barBackground}>
        {/* 1. Trang chủ */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress("Home")}
        >
          <Ionicons
            name={activeTab === "Home" ? "home" : "home-outline"}
            size={22}
            color={getColor("Home")}
          />
          <Text
            style={[
              styles.label,
              { color: getColor("Home"), fontFamily: getFontFamily("Home") },
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>

        {/* 2. Gần đây */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress("Recent")}
        >
          <Ionicons
            name={activeTab === "Recent" ? "time" : "time-outline"}
            size={24}
            color={getColor("Recent")}
          />
          <Text
            style={[
              styles.label,
              {
                color: getColor("Recent"),
                fontFamily: getFontFamily("Recent"),
              },
            ]}
          >
            Gần đây
          </Text>
        </TouchableOpacity>

        {/* 3. NÚT QUÉT (SCAN) */}
        <View style={styles.scanButtonWrapper}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => onTabPress("Scan")}
            activeOpacity={0.9}
          >
            {/* Container chứa Icon và Laser */}
            <View style={styles.iconContainer}>
              <Ionicons name="scan-outline" size={35} color="#FFFFFF" />

              {/* Thanh Laser Đỏ Di Chuyển */}
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY }] }]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Thống kê */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress("Stats")}
        >
          <Ionicons
            name={activeTab === "Stats" ? "bar-chart" : "bar-chart-outline"}
            size={22}
            color={getColor("Stats")}
          />
          <Text
            style={[
              styles.label,
              { color: getColor("Stats"), fontFamily: getFontFamily("Stats") },
            ]}
          >
            Thống kê
          </Text>
        </TouchableOpacity>

        {/* 5. Hồ sơ */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress("Profile")}
        >
          <FontAwesome5
            name={activeTab === "Profile" ? "user-alt" : "user"}
            size={20}
            color={getColor("Profile")}
          />
          <Text
            style={[
              styles.label,
              {
                color: getColor("Profile"),
                fontFamily: getFontFamily("Profile"),
              },
            ]}
          >
            Hồ sơ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
  },
  barBackground: {
    width: "100%",
    height: 80,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: 5,
    gap: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },

  // --- NÚT SCAN CHÍNH XÁC ---
  scanButtonWrapper: {
    width: 74,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 20,
    marginTop: -40, // Đẩy nút lên
  },
  scanButton: {
    width: 73,
    height: 73,
    borderRadius: 36.5,
    backgroundColor: "#1F41BB",
    justifyContent: "center",
    alignItems: "center",

    // Viền trắng
    borderWidth: 4,
    borderColor: "#FFFFFF",

    // Shadow
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },

  // --- STYLE ANIMATION ---
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35,
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    width: "80%",
    height: 2,
    backgroundColor: "#ffffffff", // Màu đỏ laser
    borderRadius: 1,
    // Glow effect
    shadowColor: "#ffffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default NavigationBar;
