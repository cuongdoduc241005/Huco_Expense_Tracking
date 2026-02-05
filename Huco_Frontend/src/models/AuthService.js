import { API_URL } from "../config/Config";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return { status: response.status, data: data };
    } catch (error) {
      console.log("Lỗi API Login:", error);
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      return { status: response.status, data: data };
    } catch (error) {
      console.log("Lỗi API Register:", error);
      throw error;
    }
  },
};

export default AuthService;
