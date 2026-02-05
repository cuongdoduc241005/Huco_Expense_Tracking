import { useState, useCallback, useLayoutEffect } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { CategoryService } from "../models/CategoryService";
import { TransactionService } from "../models/TransactionService";
import { MATERIAL_COLORS } from "../constants/Color_Icon";

export const useHomeViewModel = (navigation) => {
  const [user, setUser] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [isCatLoading, setIsCatLoading] = useState(false);

  // Form State
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());

  // Modal State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- STATE QUẢN LÝ SỬA/THÊM ---
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("star");
  const [newCatColor, setNewCatColor] = useState(MATERIAL_COLORS[0]);
  const [isEditing, setIsEditing] = useState(false); // Đang ở chế độ sửa hay thêm?
  const [editingCatId, setEditingCatId] = useState(null); // ID của danh mục đang sửa

  useLayoutEffect(() => {
    navigation.setOptions({ gestureEnabled: false, headerLeft: () => null });
  }, [navigation]);

  const loadData = async () => {
    setIsCatLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) {
        setIsCatLoading(false);
        return;
      }

      const userData = JSON.parse(userJson);
      setUser(userData);
      const userId = userData.USER_ID || userData.userId || userData.id;

      const allCats = await CategoryService.getAll(userId);
      const expenses = allCats.filter(
        (c) => c.type && c.type.toUpperCase() === "EXPENSE",
      );
      const incomes = allCats.filter(
        (c) => c.type && c.type.toUpperCase() === "INCOME",
      );

      setExpenseCategories(expenses);
      setIncomeCategories(incomes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCatLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  // --- HÀM 1: MỞ MODAL ĐỂ THÊM MỚI ---
  const openAddModal = () => {
    setNewCatName("");
    setNewCatIcon("star");
    setNewCatColor(MATERIAL_COLORS[0]);
    setIsEditing(false); // Chế độ thêm
    setEditingCatId(null);
    setShowAddCatModal(true);
  };

  // --- HÀM 2: XỬ LÝ ẤN GIỮ (HIỆN MENU SỬA/XÓA) ---
  const handleLongPressCategory = (cat) => {
    Alert.alert("Tùy chọn danh mục", `Bạn muốn làm gì với "${cat.name}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "✏️ Sửa",
        onPress: () => {
          // Đổ dữ liệu cũ vào Modal
          setNewCatName(cat.name);
          setNewCatIcon(cat.icon);
          setNewCatColor(cat.color || MATERIAL_COLORS[0]);

          // Bật chế độ sửa
          setIsEditing(true);
          setEditingCatId(cat.id);
          setShowAddCatModal(true);
        },
      },
      {
        text: "🗑️ Xóa",
        style: "destructive",
        onPress: () => confirmDelete(cat),
      },
    ]);
  };

  // --- HÀM 3: LƯU (QUYẾT ĐỊNH GỌI API THÊM HAY SỬA) ---
  const handleSaveCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập tên danh mục");
      return;
    }
    const userId = user?.USER_ID || user?.userId || user?.id;

    try {
      if (isEditing) {
        // --- GỌI API SỬA ---
        await CategoryService.update(editingCatId, {
          userId,
          name: newCatName,
          icon: newCatIcon,
          color: newCatColor,
        });
        Alert.alert("Thành công", "Đã cập nhật danh mục!");
      } else {
        // --- GỌI API THÊM ---
        await CategoryService.create({
          userId,
          name: newCatName,
          type: transactionType,
          icon: newCatIcon,
          color: newCatColor,
        });
        Alert.alert("Thành công", "Đã thêm danh mục mới!");
      }

      // Refresh lại dữ liệu và đóng modal
      await loadData();
      setShowAddCatModal(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu danh mục.");
    }
  };

  // --- HÀM 4: XÁC NHẬN XÓA ---
  const confirmDelete = (cat) => {
    Alert.alert(
      "Xác nhận xóa",
      `Xóa danh mục "${cat.name}" sẽ không xóa các giao dịch cũ, nhưng chúng sẽ mất nhãn danh mục.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa luôn",
          style: "destructive",
          onPress: async () => {
            try {
              const userId = user?.USER_ID || user?.userId || user?.id;
              await CategoryService.delete(cat.id, userId);
              await loadData(); // Reload
            } catch (e) {
              Alert.alert("Lỗi", "Không thể xóa danh mục này.");
            }
          },
        },
      ],
    );
  };

  // Logic Giao dịch (Giữ nguyên)
  const formatCurrency = (value) =>
    value ? value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  const handleAmountChange = (text) => setAmount(formatCurrency(text));
  const onChangeDate = (e, d) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (d) setDate(d);
  };
  const changeDateBy = (d) => {
    const newD = new Date(date);
    newD.setDate(date.getDate() + d);
    setDate(newD);
  };
  const getFormattedDate = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const handleSave = async () => {
    if (!amount || !selectedCategory)
      return Alert.alert("Thiếu thông tin", "Nhập tiền & chọn danh mục");
    const userId = user?.USER_ID || user?.userId || user?.id;
    const rawAmount = parseInt(amount.replace(/\./g, ""));
    try {
      await TransactionService.create({
        userId,
        type: transactionType,
        amount: rawAmount,
        categoryId: selectedCategory.id,
        date: date.toISOString().slice(0, 19).replace("T", " "),
        note,
      });
      Alert.alert("Thành công", "Đã lưu giao dịch!");
      setAmount("");
      setNote("");
      setSelectedCategory(null);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu");
    }
  };

  const currentCategories =
    transactionType === "EXPENSE" ? expenseCategories : incomeCategories;
  const categoryColumns = [];
  for (let i = 0; i < currentCategories.length; i += 2)
    categoryColumns.push(currentCategories.slice(i, i + 2));

  return {
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
    // State và Hàm mới
    newCatName,
    setNewCatName,
    newCatIcon,
    setNewCatIcon,
    newCatColor,
    setNewCatColor,
    isEditing,
    openAddModal,
    handleLongPressCategory,
    handleSaveCategory,
    categoryColumns,
    currentCategories,
    onChangeDate,
    changeDateBy,
    getFormattedDate,
    handleSave,
  };
};
