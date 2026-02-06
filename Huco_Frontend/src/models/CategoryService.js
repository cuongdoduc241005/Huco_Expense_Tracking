import { API_URL } from "../config/Config";

export const CategoryService = {
  getAll: async (userId) => {
    const res = await fetch(`${API_URL}/categories?userId=${userId}`);
    return res.ok ? await res.json() : [];
  },
  create: async (data) => {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },
  delete: async (id, userId) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }), // Gửi userId để verify chủ sở hữu
    });
    return await res.json();
  },
};
