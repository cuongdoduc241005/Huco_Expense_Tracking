import { API_URL } from "../config/Config";

export const CategoryService = {
  // Lấy danh sách
  getAll: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/categories?userId=${userId}`);
      if (!response.ok) throw new Error("Lỗi tải danh mục");
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  // Tạo mới
  create: async (data) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi tạo");
    return await response.json();
  },

  // --- SỬA (Update) ---
  update: async (categoryId, data) => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Lỗi cập nhật");
    return await response.json();
  },

  // --- XÓA (Delete) ---
  delete: async (categoryId, userId) => {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("Lỗi xóa");
    return await response.json();
  },
};
