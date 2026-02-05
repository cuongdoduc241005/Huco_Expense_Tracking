/**
 * FILE: useRecentViewModel.js
 * VAI TRÒ: Logic xử lý cho màn hình Lịch sử giao dịch
 * CHỨC NĂNG:
 * 1. Lấy dữ liệu từ API.
 * 2. Tính toán tổng thu/chi (Balance).
 * 3. Lọc dữ liệu theo thời gian/loại.
 * 4. Nhóm dữ liệu theo ngày (SectionList).
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { TransactionService } from "../models/TransactionService";

export const useRecentViewModel = (user) => {
  const [transactions, setTransactions] = useState([]); // Dữ liệu thô từ Server
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  // 1. Hàm lấy dữ liệu từ Server
  const fetchTransactions = async () => {
    if (!user?.USER_ID) return;
    setIsLoading(true);
    try {
      const data = await TransactionService.getAll(user.USER_ID);
      setTransactions(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tải khi vào màn hình
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // 2. Tính toán Tổng thu / Tổng chi (Dựa trên toàn bộ dữ liệu)
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

  // 3. Logic Lọc & Nhóm dữ liệu (Grouping)
  const groupedTransactions = useMemo(() => {
    let data = [...transactions];

    // --- BƯỚC 1: LỌC DỮ LIỆU ---
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (activeFilter === "Chi tiêu") {
      data = data.filter((t) => t.type === "EXPENSE");
    } else if (activeFilter === "Thu nhập") {
      data = data.filter((t) => t.type === "INCOME");
    } else if (activeFilter === "Tháng này") {
      data = data.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (activeFilter === "Tháng trước") {
      data = data.filter((t) => {
        const d = new Date(t.date);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      });
    }

    // --- BƯỚC 2: NHÓM THEO NGÀY (SECTION LIST) ---
    const grouped = {};

    data.forEach((item) => {
      const dateObj = new Date(item.date);

      // Tạo tiêu đề nhóm: "dd/mm/yyyy"
      const title = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
        dateObj.getMonth() + 1,
      ).padStart(2, "0")}/${dateObj.getFullYear()}`;

      // Tạo giờ hiển thị: "HH:mm"
      const timeStr = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
        dateObj.getMinutes(),
      ).padStart(2, "0")}`;

      // Format lại item để hiển thị
      const formattedItem = {
        ...item,
        time: timeStr,
        // Các trường icon, color, category đã có sẵn từ SQL (không cần map lại)
      };

      if (!grouped[title]) grouped[title] = [];
      grouped[title].push(formattedItem);
    });

    // Chuyển object thành mảng Sections và sắp xếp ngày giảm dần
    return Object.keys(grouped)
      .map((date) => ({ title: date, data: grouped[date] }))
      .sort((a, b) => {
        const dateA = a.title.split("/").reverse().join("-");
        const dateB = b.title.split("/").reverse().join("-");
        return new Date(dateB) - new Date(dateA);
      });
  }, [transactions, activeFilter]);

  return {
    isLoading,
    activeFilter,
    setActiveFilter,
    stats, // { income, expense }
    groupedTransactions, // Dữ liệu cho SectionList
    refreshData: fetchTransactions,
  };
};
