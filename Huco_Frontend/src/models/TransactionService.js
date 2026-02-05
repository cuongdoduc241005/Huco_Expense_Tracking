import { API_URL } from "../config/Config";

export const TransactionService = {
  // Lấy danh sách
  getAll: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/transactions?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Lỗi tải giao dịch");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Tạo mới
  create: async (transactionData) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error("Lỗi lưu giao dịch");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
