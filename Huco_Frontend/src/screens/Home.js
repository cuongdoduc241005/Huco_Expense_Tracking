import React, { useEffect } from "react";
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
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Components
import MainHeader from "../components/MainHeader";
import CustomAlert from "../components/CustomAlert";
import { useHomeViewModel } from "../viewmodels/useHomeViewModel";
import { AVAILABLE_ICONS, MATERIAL_COLORS } from "../constants/Color_Icon";

export default function Home({ navigation, route }) {
  // Thêm route ở đây
  const viewModel = useHomeViewModel(navigation);

  const {
    user,
    isCatLoading,
    transactionType,
    setTransactionType,
    amount,
    handleAmountChange,
    selectedCategory,
    setSelectedCategory,
    note,
    setNote,
    date,
    showAddCatModal,
    setShowAddCatModal,
    showDatePicker,
    setShowDatePicker,
    newCatName,
    setNewCatName,
    newCatIcon,
    setNewCatIcon,
    newCatColor,
    setNewCatColor,
    isEditing,
    editingTransactionId, // Lấy ID đang sửa
    initEditMode, // Hàm khởi tạo chế độ sửa
    categoryColumns,
    currentCategories,
    onChangeDate,
    changeDateBy,
    getFormattedDate,
    handleSave,
    openAddModal,
    handleLongPressCategory,
    handleSaveCategory,
    handleDeleteCategory,
    alertVisible,
    setAlertVisible,
    alertConfig,
  } = viewModel;

  // --- LOGIC NHẬN DỮ LIỆU SỬA TỪ RECENT ---
  useEffect(() => {
    if (route.params?.editItem) {
      initEditMode(route.params.editItem);
    }
  }, [route.params?.editItem]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <MainHeader user={user} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.inputSection}>
            {/* --- SWITCH THU / CHI --- */}
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  transactionType === "EXPENSE" && styles.switchBtnActive,
                ]}
                onPress={() => {
                  setTransactionType("EXPENSE");
                  setSelectedCategory(null);
                }}
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
                onPress={() => {
                  setTransactionType("INCOME");
                  setSelectedCategory(null);
                }}
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

            {/* --- NGÀY THÁNG --- */}
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

            {/* --- SỐ TIỀN --- */}
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

            {/* --- DANH MỤC --- */}
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <View style={{ height: 190, marginBottom: 15 }}>
              {isCatLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#1F41BB"
                  style={{ marginTop: 50 }}
                />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {currentCategories.length > 0
                    ? categoryColumns.map((col, colIndex) => (
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
                              onLongPress={() => handleLongPressCategory(cat)}
                              delayLongPress={500}
                            >
                              <View
                                style={[
                                  styles.iconCircle,
                                  {
                                    backgroundColor:
                                      (cat.color || "#999") + "20",
                                  },
                                ]}
                              >
                                <FontAwesome5
                                  name={cat.icon || "question"}
                                  size={20}
                                  color={cat.color || "#999"}
                                />
                              </View>
                              <Text
                                style={styles.categoryName}
                                numberOfLines={1}
                              >
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
                      ))
                    : null}

                  <View style={styles.columnContainer}>
                    <TouchableOpacity
                      style={styles.categoryItemBox}
                      onPress={openAddModal}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: "#F0F0F0" },
                        ]}
                      >
                        <Ionicons name="add" size={24} color="#999" />
                      </View>
                      <Text style={styles.categoryName}>Thêm</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>

            {/* --- GHI CHÚ --- */}
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.noteContainer}>
              <MaterialCommunityIcons
                name="note-text-outline"
                size={24}
                color="#999"
              />
              <TextInput
                style={styles.noteInput}
                placeholder="Ghi chú..."
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* NÚT LƯU CỦA FORM */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingTransactionId ? "Cập nhật giao dịch" : "Lưu giao dịch"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- MODAL CHỌN NGÀY --- */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onChangeDate}
        />
      )}

      {/* --- MODAL THÊM / SỬA DANH MỤC --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCatModal}
        onRequestClose={() => setShowAddCatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addCategoryModal}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text style={styles.modalTitle}>
                {isEditing ? "Sửa danh mục" : "Thêm danh mục"}
              </Text>
              {isEditing && (
                <TouchableOpacity onPress={handleDeleteCategory}>
                  <Ionicons name="trash-outline" size={24} color="#F44336" />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Tên danh mục..."
              value={newCatName}
              onChangeText={setNewCatName}
            />

            <Text style={styles.inputLabel}>Màu sắc</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 15 }}
            >
              {MATERIAL_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    newCatColor === color && styles.colorCircleSelected,
                  ]}
                  onPress={() => setNewCatColor(color)}
                />
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Biểu tượng</Text>
            <View style={{ height: 200 }}>
              <FlatList
                data={AVAILABLE_ICONS}
                numColumns={5}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.iconSelectBtn,
                      newCatIcon === item && { backgroundColor: newCatColor },
                    ]}
                    onPress={() => setNewCatIcon(item)}
                  >
                    <FontAwesome5
                      name={item}
                      size={18}
                      color={newCatIcon === item ? "#FFF" : "#555"}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setShowAddCatModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveCategory}
                style={[styles.modalSaveBtn, { backgroundColor: newCatColor }]}
              >
                <Text style={styles.modalSaveText}>
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onCancel={() => setAlertVisible(false)}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

// ... Giữ nguyên phần styles của bạn ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  inputSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    flex: 1,
    minHeight: "100%",
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
  switchBtnActive: { backgroundColor: "#FFFFFF", elevation: 2 },
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
  columnContainer: { flexDirection: "column", marginRight: 15, gap: 15 },
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
  },
  checkMark: { position: "absolute", top: 5, right: 5 },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  noteInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#1F41BB",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  saveButtonText: {
    fontFamily: "Montserrat-Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  addCategoryModal: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: { fontFamily: "Montserrat-Bold", fontSize: 18, color: "#333" },
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
    marginBottom: 15,
  },
  iconSelectBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    backgroundColor: "#F0F0F0",
  },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelBtn: { flex: 1, padding: 15, alignItems: "center" },
  modalCancelText: { color: "#999", fontWeight: "bold" },
  modalSaveBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  modalSaveText: { color: "#FFF", fontWeight: "bold" },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "white",
  },
  colorCircleSelected: { borderColor: "#333" },
});
