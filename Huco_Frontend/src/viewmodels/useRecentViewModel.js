import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransactionService } from "../models/TransactionService";

export const useRecentViewModel = (initialUser) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tất cả"); // Quản lý trạng thái lọc
  const [user, setUser] = useState(initialUser);

  const fetchTransactions = async () => {
    try {
      let currentUser = user;
      if (!currentUser) {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          currentUser = JSON.parse(userJson);
          setUser(currentUser);
        }
      }
      if (!currentUser?.USER_ID) return;
      setIsLoading(true);
      const data = await TransactionService.getAll(currentUser.USER_ID);
      setTransactions(data);
    } catch (error) {
      console.error("Lỗi fetchTransactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const deleteTransaction = async (id) => {
    try {
      const res = await TransactionService.delete(id);
      if (res.status === 200) {
        // Cập nhật local state để biến mất ngay trên màn hình
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // --- LOGIC LỌC DỮ LIỆU ĐƯỢC BỔ SUNG ---
  const groupedTransactions = useMemo(() => {
    let data = [...transactions];
    const now = new Date();

    // 1. Lọc theo Loại (Thu/Chi)
    if (activeFilter === "Chi tiêu") {
      data = data.filter((t) => t.type === "EXPENSE");
    } else if (activeFilter === "Thu nhập") {
      data = data.filter((t) => t.type === "INCOME");
    }
    // 2. Lọc theo Thời gian (Tháng này)
    else if (activeFilter === "Tháng này") {
      data = data.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // Nhóm theo ngày cho SectionList
    const grouped = {};
    data.forEach((item) => {
      const dateObj = new Date(item.date);
      const title = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
      if (!grouped[title]) grouped[title] = [];
      grouped[title].push({
        ...item,
        time: `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`,
      });
    });

    return Object.keys(grouped)
      .map((date) => ({ title: date, data: grouped[date] }))
      .sort(
        (a, b) =>
          new Date(b.title.split("/").reverse().join("-")) -
          new Date(a.title.split("/").reverse().join("-")),
      );
  }, [transactions, activeFilter]);

  // Tính toán số liệu thống kê dựa trên dữ liệu đã lọc
  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        const amt = Number(curr.amount);
        if (curr.type === "INCOME") acc.income += amt;
        else acc.expense += amt;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  return {
    isLoading,
    activeFilter,
    setActiveFilter,
    stats,
    groupedTransactions,
    refreshData: fetchTransactions,
    deleteTransaction,
  };
};
