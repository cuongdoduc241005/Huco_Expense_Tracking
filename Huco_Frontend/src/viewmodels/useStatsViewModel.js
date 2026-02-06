// src/viewmodels/useStatsViewModel.js
import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/Config";

export const useStatsViewModel = (initialUser) => {
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);
  const [date, setDate] = useState(new Date());

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : initialUser;
      if (!user?.USER_ID) return;

      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // TRUYỀN THAM SỐ month VÀ year VÀO API
      const response = await fetch(
        `${API_URL}/transactions/stats/${user.USER_ID}?type=${transactionType}&month=${month}&year=${year}`,
      );
      const data = await response.json();

      if (data.pieData && data.pieData.length > 0) {
        const total = data.pieData.reduce(
          (sum, item) => sum + Number(item.amount),
          0,
        );
        let currentAngle = -Math.PI / 2;

        const formattedPie = data.pieData.map((item) => {
          const amount = Number(item.amount);
          const sliceAngle = (amount / total) * (Math.PI * 2);
          const res = {
            ...item,
            amount,
            percent: amount / total,
            startAngle: currentAngle,
            endAngle: currentAngle + sliceAngle,
          };
          currentAngle += sliceAngle;
          return res;
        });
        setPieData(formattedPie);
      } else {
        setPieData([]);
      }
    } catch (error) {
      console.error("Lỗi fetchStats:", error);
      setPieData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [transactionType, date]);

  const changeMonthBy = (offset) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + offset);
    setDate(newDate); // Cập nhật state date
  };

  const pieTotal = useMemo(
    () => pieData.reduce((s, i) => s + Number(i.amount), 0),
    [pieData],
  );

  return {
    isLoading,
    transactionType,
    setTransactionType,
    selectedSliceIndex,
    setSelectedSliceIndex,
    pieData,
    pieTotal,
    date,
    setDate,
    changeMonthBy,
    refreshData: fetchStats,
    chartData: [],
    selectedUnit: "1m",
  };
};
