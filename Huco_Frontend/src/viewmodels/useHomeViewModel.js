import { useState, useCallback, useEffect } from "react";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { CategoryService } from "../models/CategoryService";
import { TransactionService } from "../models/TransactionService";
import { MATERIAL_COLORS } from "../constants/Color_Icon";

export const useHomeViewModel = (navigation) => {
  // --- STATE NGƯỜI DÙNG & DANH MỤC ---
  const [user, setUser] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [isCatLoading, setIsCatLoading] = useState(false);

  // --- STATE FORM GIAO DỊCH ---
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [editingTransactionId, setEditingTransactionId] = useState(null); // ID giao dịch đang sửa

  // --- STATE MODAL & UI ---
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("star");
  const [newCatColor, setNewCatColor] = useState(MATERIAL_COLORS[0]);
  const [isEditing, setIsEditing] = useState(false); // Chế độ sửa danh mục
  const [editingCatId, setEditingCatId] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const showAlert = (title, message, type = "success", onConfirm = null) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const loadData = async () => {
    setIsCatLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) return;
      const userData = JSON.parse(userJson);
      setUser(userData);
      const data = await CategoryService.getAll(userData.USER_ID);

      const exp = data.filter((c) => c.type === "EXPENSE");
      const inc = data.filter((c) => c.type === "INCOME");

      setExpenseCategories(exp);
      setIncomeCategories(inc);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCatLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [transactionType]),
  );

  // --- LOGIC TIẾP NHẬN DỮ LIỆU SỬA GIAO DỊCH TỪ RECENT ---
  const initEditMode = (item) => {
    if (!item) return;
    setEditingTransactionId(item.id);
    setAmount(item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
    setNote(item.note || "");
    setDate(new Date(item.date));
    setTransactionType(item.type);

    // Tìm và chọn lại danh mục tương ứng trong list
    const list = item.type === "EXPENSE" ? expenseCategories : incomeCategories;
    const found = list.find((c) => c.name === item.category);
    if (found) setSelectedCategory(found);
  };

  // --- QUẢN LÝ DANH MỤC (CATEGORY) ---
  const handleLongPressCategory = (cat) => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setNewCatIcon(cat.icon);
    setNewCatColor(cat.color || MATERIAL_COLORS[0]);
    setIsEditing(true);
    setShowAddCatModal(true);
  };

  const handleSaveCategory = async () => {
    if (!newCatName.trim())
      return showAlert("Lỗi", "Vui lòng nhập tên", "error");
    try {
      if (isEditing) {
        await CategoryService.update(editingCatId, {
          userId: user.USER_ID,
          name: newCatName,
          icon: newCatIcon,
          color: newCatColor,
        });
      } else {
        await CategoryService.create({
          userId: user.USER_ID,
          name: newCatName,
          type: transactionType,
          icon: newCatIcon,
          color: newCatColor,
        });
      }
      setShowAddCatModal(false);
      setTimeout(() => loadData(), 300);
    } catch (e) {
      showAlert("Lỗi", "Không thể lưu danh mục", "error");
    }
  };

  const handleDeleteCategory = () => {
    if (!editingCatId) return;
    setShowAddCatModal(false);
    setTimeout(() => {
      showAlert(
        "Xác nhận xóa",
        `Xóa danh mục "${newCatName}"?`,
        "warning",
        async () => {
          try {
            await CategoryService.delete(editingCatId, user?.USER_ID);
            if (Platform.OS !== "web")
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            setAlertVisible(false);
            if (selectedCategory?.id === editingCatId)
              setSelectedCategory(null);
            loadData();
          } catch (error) {
            setAlertVisible(false);
            Alert.alert(
              "Lỗi",
              "Danh mục này đang có giao dịch, không thể xóa.",
            );
          }
        },
      );
    }, 400);
  };

  // --- QUẢN LÝ GIAO DỊCH (TRANSACTION) ---
  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      showAlert("Thông báo", "Vui lòng nhập tiền và chọn danh mục!", "warning");
      return;
    }

    const rawAmount = parseInt(amount.replace(/\./g, ""));
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

    const payload = {
      userId: user?.USER_ID,
      categoryId: selectedCategory.id,
      amount: rawAmount,
      date: formattedDate,
      note: note,
    };

    try {
      let result;
      if (editingTransactionId) {
        // Chế độ CẬP NHẬT
        result = await TransactionService.update(editingTransactionId, payload);
      } else {
        // Chế độ THÊM MỚI
        result = await TransactionService.create(payload);
      }

      if (result.status === 201 || result.status === 200) {
        if (Platform.OS !== "web")
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        showAlert(
          "Thành công",
          editingTransactionId ? "Đã cập nhật giao dịch!" : "Đã lưu giao dịch!",
          "success",
          () => {
            // Reset form
            setAmount("");
            setNote("");
            setSelectedCategory(null);
            setEditingTransactionId(null);
            setAlertVisible(false);
            // Nếu là sửa thì quay về trang trước đó
            if (editingTransactionId) navigation.goBack();
          },
        );
      }
    } catch (error) {
      console.error("Lỗi handleSave:", error);
      showAlert("Lỗi", "Không thể kết nối tới máy chủ.", "error");
    }
  };

  return {
    user,
    isCatLoading,
    transactionType,
    setTransactionType,
    amount,
    handleAmountChange: (t) =>
      setAmount(t.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")),
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
    editingTransactionId,
    initEditMode, // Xuất hàm để Component Home sử dụng
    currentCategories:
      transactionType === "EXPENSE" ? expenseCategories : incomeCategories,
    categoryColumns: (() => {
      const cats =
        transactionType === "EXPENSE" ? expenseCategories : incomeCategories;
      const cols = [];
      for (let i = 0; i < cats.length; i += 2) cols.push(cats.slice(i, i + 2));
      return cols;
    })(),
    onChangeDate: (e, d) => {
      setShowDatePicker(false);
      if (d) setDate(d);
    },
    changeDateBy: (n) => {
      const d = new Date(date);
      d.setDate(d.getDate() + n);
      setDate(d);
    },
    getFormattedDate: (d) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    handleSave,
    openAddModal: () => {
      setIsEditing(false);
      setNewCatName("");
      setNewCatIcon("star");
      setShowAddCatModal(true);
    },
    handleLongPressCategory,
    handleSaveCategory,
    handleDeleteCategory,
    alertVisible,
    setAlertVisible,
    alertConfig,
  };
};
