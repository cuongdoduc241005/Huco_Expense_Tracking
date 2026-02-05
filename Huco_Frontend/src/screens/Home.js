import React from "react";
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

export default function Home({ navigation }) {
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
  } = useHomeViewModel(navigation);

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
                  {currentCategories.length > 0 ? (
                    categoryColumns.map((col, colIndex) => (
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
                            onLongPress={() => handleLongPressCategory(cat)} // Long Press để Sửa/Xóa
                            delayLongPress={500}
                          >
                            <View
                              style={[
                                styles.iconCircle,
                                {
                                  backgroundColor: (cat.color || "#999") + "20",
                                },
                              ]}
                            >
                              <FontAwesome5
                                name={cat.icon || "question"}
                                size={20}
                                color={cat.color || "#999"}
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
                    ))
                  ) : (
                    <View style={{ justifyContent: "center", paddingLeft: 10 }}>
                      <Text style={{ color: "#999", fontSize: 14 }}>
                        Chưa có danh mục
                      </Text>
                    </View>
                  )}

                  {/* NÚT THÊM DANH MỤC */}
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
                      <Text style={styles.categoryName}>Khác</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>

            {/* --- GHI CHÚ & LƯU --- */}
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- MODAL CHỌN NGÀY --- */}
      {showDatePicker &&
        (Platform.OS === "ios" ? (
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
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        ))}

      {/* --- MODAL THÊM / SỬA DANH MỤC --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCatModal}
        onRequestClose={() => setShowAddCatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addCategoryModal}>
            {/* Header Modal: Title + Delete Button */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.modalTitle}>
                {isEditing ? "Sửa danh mục" : "Thêm mới"}
              </Text>
              {isEditing && (
                <TouchableOpacity
                  onPress={handleDeleteCategory}
                  style={{ padding: 5 }}
                >
                  <Ionicons name="trash-outline" size={24} color="#F44336" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.inputLabel}>Tên danh mục</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Ăn sáng..."
              value={newCatName}
              onChangeText={setNewCatName}
            />

            <Text style={styles.inputLabel}>Chọn màu</Text>
            <View style={{ height: 50, marginBottom: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            </View>

            <Text style={styles.inputLabel}>Chọn biểu tượng</Text>
            <View style={styles.iconGridContainer}>
              <FlatList
                data={AVAILABLE_ICONS}
                numColumns={5}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.iconSelectBtn,
                      newCatIcon === item && styles.iconSelectBtnActive,
                      {
                        backgroundColor:
                          newCatIcon === item ? newCatColor : "#F0F0F0",
                      },
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
                style={[styles.modalSaveBtn, { backgroundColor: newCatColor }]}
                onPress={handleSaveCategory}
              >
                <Text style={styles.modalSaveText}>
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- CUSTOM ALERT (LUÔN ĐỂ Ở CUỐI) --- */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
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
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "white",
  },
  colorCircleSelected: {
    borderColor: "#333",
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
});
