/**
 * FILE: Recent.js
 * VAI TRÒ: Màn hình chi tiết lịch sử giao dịch
 * ĐẶC ĐIỂM: Sử dụng SectionList để gom nhóm giao dịch theo ngày.
 */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  SectionList,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// --- IMPORT COMPONENT & VIEWMODEL ---
import MainHeader from "../components/MainHeader";
import { useRecentViewModel } from "../viewmodels/useRecentViewModel";

const FILTERS = ["Tất cả", "Chi tiêu", "Thu nhập", "Tháng này", "Tháng trước"];

export default function Recent({ navigation, route }) {
  // 1. Nhận user từ params (được truyền từ Home)
  const user = route.params?.user;

  // 2. Gọi ViewModel để lấy logic và dữ liệu
  const {
    isLoading,
    activeFilter,
    setActiveFilter,
    stats,
    groupedTransactions,
    refreshData,
  } = useRecentViewModel(user);

  // --- UI STATE (Chỉ quản lý hiển thị cục bộ) ---
  const [showBalance, setShowBalance] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // --- HELPER FUNCTION ---
  const formatCurrency = (amount) =>
    Number(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // --- RENDER ITEM ---
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => {
        setSelectedItem(item);
        setMenuVisible(true);
      }}
    >
      <View style={[styles.iconBox, { backgroundColor: item.color + "20" }]}>
        <FontAwesome5 name={item.icon} size={18} color={item.color} />
      </View>
      <View style={styles.contentBox}>
        <View style={styles.topRow}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text
            style={[
              styles.amountText,
              { color: item.type === "INCOME" ? "#00C853" : "#F44336" },
            ]}
          >
            {item.type === "INCOME" ? "+" : "-"}
            {formatCurrency(item.amount)} ₫
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.noteText} numberOfLines={1}>
            {item.note || "Không có ghi chú"}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <MainHeader user={user} />

      {/* --- PHẦN CỐ ĐỊNH (FIXED HEADER) --- */}
      <View style={styles.fixedHeader}>
        {/* CARD TỔNG QUAN (BALANCE) */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Tổng số dư</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? "eye" : "eye-off"}
                size={20}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalBalanceText}>
            {showBalance
              ? formatCurrency(stats.income - stats.expense) + " ₫"
              : "******"}
          </Text>
          <View style={styles.balanceRow}>
            {/* Tổng Thu */}
            <View style={styles.balanceItem}>
              <View style={styles.arrowIconDown}>
                <Ionicons name="arrow-down" size={16} color="#FFF" />
              </View>
              <View>
                <Text style={styles.subLabel}>Thu nhập</Text>
                <Text style={styles.subValue}>
                  {showBalance ? formatCurrency(stats.income) + " ₫" : "******"}
                </Text>
              </View>
            </View>

            {/* Tổng Chi */}
            <View style={styles.balanceItem}>
              <View style={styles.arrowIconUp}>
                <Ionicons name="arrow-up" size={16} color="#FFF" />
              </View>
              <View>
                <Text style={styles.subLabel}>Chi tiêu</Text>
                <Text style={styles.subValue}>
                  {showBalance
                    ? formatCurrency(stats.expense) + " ₫"
                    : "******"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* THANH BỘ LỌC (FILTERS) */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* --- DANH SÁCH GIAO DỊCH (SECTION LIST) --- */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#1F41BB"
            style={{ marginTop: 50 }}
          />
        ) : (
          <SectionList
            sections={groupedTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
            stickySectionHeadersEnabled={true}
            onRefresh={refreshData}
            refreshing={isLoading}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text
                  style={{ color: "#999", fontFamily: "Montserrat-Regular" }}
                >
                  Không có dữ liệu
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* --- MODAL TÙY CHỌN (MENU) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>Tùy chọn</Text>

            {/* Nút Sửa */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Thông báo", "Tính năng 'Sửa' đang phát triển");
              }}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#1F41BB" />
              <Text style={styles.menuOptionText}>Sửa</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Nút Xóa */}
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert(
                  "Xác nhận xóa",
                  "Bạn có chắc muốn xóa giao dịch này?",
                  [
                    { text: "Hủy", style: "cancel" },
                    {
                      text: "Xóa",
                      style: "destructive",
                      onPress: () => console.log("Delete", selectedItem?.id),
                    },
                  ],
                );
              }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color="#F44336"
              />
              <Text style={[styles.menuOptionText, { color: "#F44336" }]}>
                Xóa
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Giữ nguyên Styles cũ của bạn
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  fixedHeader: {
    backgroundColor: "#F9F9F9",
    paddingTop: 10,
    zIndex: 10,
  },
  balanceCard: {
    backgroundColor: "#1F41BB",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
  totalBalanceText: {
    color: "#FFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 32,
    marginBottom: 15,
  },
  subValue: { color: "#FFF", fontSize: 15, fontFamily: "Montserrat-Bold" },
  balanceRow: { flexDirection: "row", justifyContent: "space-between" },
  balanceItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  arrowIconDown: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIconUp: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  subLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  filterContainer: { marginBottom: 15 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  filterChipActive: { backgroundColor: "#1F41BB", borderColor: "#1F41BB" },
  filterText: { color: "#666", fontFamily: "Montserrat-Medium", fontSize: 13 },
  filterTextActive: { color: "#FFF", fontFamily: "Montserrat-SemiBold" },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
  },
  sectionHeaderText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#888",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    marginBottom: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contentBox: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    color: "#333",
  },
  amountText: { fontFamily: "Montserrat-Bold", fontSize: 15 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between" },
  noteText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 13,
    color: "#888",
    flex: 1,
  },
  timeText: { fontFamily: "Montserrat-Regular", fontSize: 12, color: "#AAA" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  menuTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
  },
  menuOptionText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  menuDivider: { width: "100%", height: 1, backgroundColor: "#EEE" },
});
