/**
 * FILE: useStatsViewModel.js
 * VAI TRÒ: Logic xử lý số liệu cho màn hình Thống kê (Stats)
 * CHỨC NĂNG:
 * 1. Lấy dữ liệu từ API.
 * 2. Xử lý dữ liệu cho Biểu đồ Xu hướng (Line/Bar Chart).
 * 3. Xử lý dữ liệu cho Biểu đồ Tròn (Pie Chart).
 */

import { useState, useEffect, useMemo } from "react";
import { TransactionService } from "../models/TransactionService";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Cấu hình Pie Chart
const PIE_RADIUS = width / 3.2;

export const useStatsViewModel = (user) => {
  const [transactions, setTransactions] = useState([]); // Dữ liệu thô
  const [isLoading, setIsLoading] = useState(false);

  // State bộ lọc
  const [transactionType, setTransactionType] = useState("EXPENSE"); // EXPENSE | INCOME
  const [selectedUnit, setSelectedUnit] = useState("1d"); // 1d, 1w, 1m...

  // State tương tác biểu đồ
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);

  // 1. Hàm lấy dữ liệu
  const fetchTransactions = async () => {
    if (!user?.USER_ID) return;
    setIsLoading(true);
    try {
      const data = await TransactionService.getAll(user.USER_ID);
      setTransactions(data);
    } catch (error) {
      console.error("Lỗi Stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Khi đổi loại (Thu/Chi), reset các selection
  useEffect(() => {
    setSelectedBarIndex(null);
    setSelectedSliceIndex(null);
  }, [transactionType]);

  // 2. Logic xử lý BIỂU ĐỒ XU HƯỚNG (Line/Bar Chart)
  const chartData = useMemo(() => {
    // Lọc theo loại
    const filtered = transactions.filter((t) => t.type === transactionType);

    // Sắp xếp tăng dần theo thời gian
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // Nhóm dữ liệu theo ngày (Logic đơn giản cho demo "Ngày")
    // Bạn có thể mở rộng logic này cho Tuần/Tháng dựa vào selectedUnit
    const grouped = {};

    sorted.forEach((item) => {
      const date = new Date(item.date);
      const day = date.getDate();
      const month = date.getMonth() + 1;

      // Key là "d/m"
      const key = `${day}/${month}`;

      if (!grouped[key]) {
        grouped[key] = {
          label: key,
          day: day, // Dùng để check hiển thị label
          value: 0,
        };
      }
      grouped[key].value += Number(item.amount);
    });

    return Object.values(grouped);
  }, [transactions, transactionType]); // Chỉ tính lại khi data hoặc loại thay đổi

  // 3. Logic xử lý BIỂU ĐỒ TRÒN (Pie Chart)
  const pieDataObj = useMemo(() => {
    // Lọc data
    const filtered = transactions.filter((t) => t.type === transactionType);

    // Nhóm theo Danh mục (Category)
    const catMap = {};

    filtered.forEach((t) => {
      // Dữ liệu từ API đã có sẵn category, icon, color
      const catName = t.category || "Khác";

      if (!catMap[catName]) {
        catMap[catName] = {
          id: t.categoryId || catName, // Dùng tên làm ID tạm nếu null
          name: catName,
          icon: t.icon || "question",
          color: t.color || "#999",
          amount: 0,
        };
      }
      catMap[catName].amount += Number(t.amount);
    });

    // Sắp xếp giảm dần & Lấy Top 5
    let data = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Tính tổng tiền của Top 5 (hoặc toàn bộ tùy logic)
    const total = data.reduce((sum, item) => sum + item.amount, 0);

    // Tính góc (Angle) cho SVG
    let currentAngle = 0;
    data = data.map((item) => {
      const percent = total === 0 ? 0 : item.amount / total;
      const angle = percent * 2 * Math.PI; // Đổi sang Radian

      const itemData = {
        ...item,
        percent,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      };

      currentAngle += angle;
      return itemData;
    });

    return { data, total };
  }, [transactions, transactionType]);

  return {
    isLoading,
    transactionType,
    setTransactionType,
    selectedUnit,
    setSelectedUnit,
    selectedBarIndex,
    setSelectedBarIndex,
    selectedSliceIndex,
    setSelectedSliceIndex,

    chartData, // Data cho Bar Chart
    pieData: pieDataObj.data, // List danh mục Top 5
    pieTotal: pieDataObj.total, // Tổng tiền hiển thị giữa vòng tròn

    refreshData: fetchTransactions,
  };
};
