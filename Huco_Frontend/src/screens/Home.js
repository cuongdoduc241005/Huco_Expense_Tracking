import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// --- IMPORT COMPONENT & DATA ---
import MainHeader from "../components/MainHeader";

// 1. Lấy Tài nguyên tĩnh (Màu, Icon) từ data.js
import { MATERIAL_COLORS, AVAILABLE_ICONS } from "../constants/Color_Icon";

// 2. Lấy Dữ liệu giả lập (Danh mục) từ mockData.js
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/MockData";

export default function Home({ navigation }) {
  // Chặn vuốt Back trên iOS (nếu cần)
  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false, headerLeft: () => null });
  }, [navigation]);

  // --- STATE ---
  // Khởi tạo danh mục từ file Mock Data
  const [expenseCategories, setExpenseCategories] =
    useState(EXPENSE_CATEGORIES);
  const [incomeCategories, setIncomeCategories] = useState(INCOME_CATEGORIES);

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("star");

  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- LOGIC ---
  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleAmountChange = (text) => setAmount(formatCurrency(text));

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };
  const changeDateBy = (days) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };
  const getFormattedDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = () => {
    if (!amount || !selectedCategory) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập số tiền và chọn danh mục!");
      return;
    }
    const rawAmount = parseInt(amount.replace(/\./g, ""));
    console.log("Saving Transaction:", {
      type: transactionType,
      amount: rawAmount,
      category: selectedCategory,
      date: date.toISOString(),
      note,
    });
    Alert.alert(
      "Thành công",
      `Đã lưu ${amount} đ vào mục ${selectedCategory.name}!`
    );
    setAmount("");
    setNote("");
    setSelectedCategory(null);
  };

  const handleAddNewCategory = () => {
    if (!newCatName.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập tên danh mục!");
      return;
    }
    // Lấy màu ngẫu nhiên từ file data.js
    const randomColor =
      MATERIAL_COLORS[Math.floor(Math.random() * MATERIAL_COLORS.length)];

    const newCategory = {
      id: Date.now(),
      name: newCatName,
      icon: newCatIcon,
      color: randomColor,
    };

    if (transactionType === "EXPENSE") {
      setExpenseCategories([...expenseCategories, newCategory]);
    } else {
      setIncomeCategories([...incomeCategories, newCategory]);
    }
    setNewCatName("");
    setNewCatIcon("star");
    setShowAddCatModal(false);
    setSelectedCategory(newCategory);
  };

  const currentCategories =
    transactionType === "EXPENSE" ? expenseCategories : incomeCategories;

  const categoryColumns = [];
  for (let i = 0; i < currentCategories.length; i += 2) {
    categoryColumns.push(currentCategories.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />

      {/* --- HEADER CỐ ĐỊNH (Nằm ngoài ScrollView) --- */}
      <MainHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* INPUT SECTION */}
          <View style={styles.inputSection}>
            {/* SWITCH CHI TIÊU / THU NHẬP */}
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  transactionType === "EXPENSE" && styles.switchBtnActive,
                ]}
                onPress={() => setTransactionType("EXPENSE")}
              >
                <Text
                  style={[
                    styles.switchText,
                    transactionType === "EXPENSE" && styles.switchTextActive,
                  ]}
                >
                  Chi tiêu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  transactionType === "INCOME" && styles.switchBtnActive,
                ]}
                onPress={() => setTransactionType("INCOME")}
              >
                <Text
                  style={[
                    styles.switchText,
                    transactionType === "INCOME" && styles.switchTextActive,
                  ]}
                >
                  Thu nhập
                </Text>
              </TouchableOpacity>
            </View>

            {/* NGÀY THÁNG */}
            <View style={styles.dateControlRow}>
              <TouchableOpacity
                onPress={() => changeDateBy(-1)}
                style={styles.arrowButton}
              >
                <Ionicons name="chevron-back" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateDisplay}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#1F41BB"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.dateText}>{getFormattedDate(date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeDateBy(1)}
                style={styles.arrowButton}
              >
                <Ionicons name="chevron-forward" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            {/* NHẬP TIỀN */}
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₫</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#BDBDBD"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </View>

            {/* DANH MỤC */}
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <View style={{ height: 190, marginBottom: 15 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {categoryColumns.map((col, colIndex) => (
                  <View key={colIndex} style={styles.columnContainer}>
                    {col.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryItemBox,
                          selectedCategory?.id === cat.id &&
                            styles.categoryItemBoxSelected,
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <View
                          style={[
                            styles.iconCircle,
                            { backgroundColor: cat.color + "20" },
                          ]}
                        >
                          <FontAwesome5
                            name={cat.icon}
                            size={20}
                            color={cat.color}
                          />
                        </View>
                        <Text style={styles.categoryName} numberOfLines={1}>
                          {cat.name}
                        </Text>
                        {selectedCategory?.id === cat.id && (
                          <View style={styles.checkMark}>
                            <Ionicons
                              name="checkmark-circle"
                              size={16}
                              color="#1F41BB"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}

                {/* Nút Thêm Danh Mục */}
                <View style={styles.columnContainer}>
                  <TouchableOpacity
                    style={styles.categoryItemBox}
                    onPress={() => setShowAddCatModal(true)}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: "#F0F0F0" },
                      ]}
                    >
                      <Ionicons name="add" size={24} color="#999" />
                    </View>
                    <Text style={styles.categoryName}>Khác</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* GHI CHÚ */}
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.noteContainer}>
              <MaterialCommunityIcons
                name="note-text-outline"
                size={24}
                color="#999"
              />
              <TextInput
                style={styles.noteInput}
                placeholder={
                  transactionType === "EXPENSE"
                    ? "VD: Ăn sáng..."
                    : "VD: Lương tháng..."
                }
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* NÚT LƯU */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- CÁC MODAL --- */}

      {/* MODAL DATE PICKER */}
      {showDatePicker && Platform.OS === "ios" && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={onChangeDate}
                themeVariant="light"
                textColor="#000000"
                style={{ width: 310, height: 310, backgroundColor: "white" }}
              />
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.closeModalText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* MODAL THÊM DANH MỤC */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCatModal}
        onRequestClose={() => setShowAddCatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addCategoryModal}>
            <Text style={styles.modalTitle}>Thêm danh mục mới</Text>

            <Text style={styles.inputLabel}>Tên danh mục</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Trà sữa, Gym..."
              value={newCatName}
              onChangeText={setNewCatName}
            />

            <Text style={styles.inputLabel}>Chọn biểu tượng</Text>
            <View style={styles.iconGridContainer}>
              <FlatList
                data={AVAILABLE_ICONS}
                numColumns={5}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.iconSelectBtn,
                      newCatIcon === item && styles.iconSelectBtnActive,
                    ]}
                    onPress={() => setNewCatIcon(item)}
                  >
                    <FontAwesome5
                      name={item}
                      size={18}
                      color={newCatIcon === item ? "#FFFFFF" : "#555"}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddCatModal(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddNewCategory}
              >
                <Text style={styles.modalSaveText}>Tạo mới</Text>
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

  // Style cho phần Input (Card trắng)
  inputSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    flex: 1,
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F4FF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  switchBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  switchText: { fontFamily: "Montserrat-Medium", color: "#999" },
  switchTextActive: { fontFamily: "Montserrat-SemiBold", color: "#1F41BB" },

  dateControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  arrowButton: { padding: 10 },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 15,
    minWidth: 150,
    justifyContent: "center",
  },
  dateText: { fontFamily: "Montserrat-SemiBold", color: "#333", fontSize: 15 },

  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
    marginBottom: 25,
  },
  currencySymbol: {
    fontSize: 30,
    color: "#1F41BB",
    fontFamily: "Montserrat-Bold",
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 35,
    fontFamily: "Montserrat-Bold",
    color: "#333",
  },

  sectionTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  columnContainer: {
    flexDirection: "column",
    marginRight: 15,
    justifyContent: "flex-start",
    gap: 15,
  },
  categoryItemBox: {
    width: 90,
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    backgroundColor: "#FAFAFA",
  },
  categoryItemBoxSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#1F41BB",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryName: {
    fontFamily: "Montserrat-Medium",
    fontSize: 11,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  checkMark: { position: "absolute", top: 5, right: 5 },

  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 30,
  },
  noteInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#1F41BB",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  saveButtonText: {
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  closeModalButton: {
    marginTop: 15,
    backgroundColor: "#1F41BB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  closeModalText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  addCategoryModal: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
    color: "#333",
  },
  iconGridContainer: { height: 250, marginTop: 5, marginBottom: 10 },
  iconSelectBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  iconSelectBtnActive: { backgroundColor: "#1F41BB" },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalCancelBtn: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    marginRight: 10,
  },
  modalCancelText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#999",
    fontSize: 16,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: "#1F41BB",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  modalSaveText: {
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
