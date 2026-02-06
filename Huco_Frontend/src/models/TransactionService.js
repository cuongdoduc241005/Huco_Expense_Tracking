import { API_URL } from "../config/Config";

export const TransactionService = {
  create: async (data) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { status: res.status, data: await res.json() };
  },

  getAll: async (userId) => {
    const res = await fetch(`${API_URL}/transactions/${userId}`);
    return res.ok ? await res.json() : [];
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { status: res.status, data: await res.json() };
  },

  // HÀM CẬP NHẬT GIAO DỊCH
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { status: res.status, data: await res.json() };
  },

  // HÀM XÓA GIAO DỊCH
  delete: async (id) => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    return { status: res.status };
  },

  getAll: async (userId) => {
    const res = await fetch(`${API_URL}/transactions/${userId}`);
    return res.ok ? await res.json() : [];
  },
};
