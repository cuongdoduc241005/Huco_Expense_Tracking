/**
 * --- CONTROLLER TRANSACTION ---
 * Vai trò: Bộ não xử lý logic cho các giao dịch thu chi.
 * Nhiệm vụ:
 * 1. Nhận yêu cầu lấy danh sách giao dịch.
 * 2. Gọi Model Transaction để lấy dữ liệu.
 * 3. Trả về mảng JSON cho App hiển thị.
 */

const Transaction = require("../models/Transaction");

// 1. Lấy danh sách giao dịch (Có lọc theo User)
exports.getTransactions = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Thiếu UserId" });
  }

  try {
    const transactions = await Transaction.getAll(userId);
    res.json(transactions);
  } catch (error) {
    console.error("Lỗi lấy giao dịch:", error);
    res.status(500).json({ message: "Lỗi Server khi lấy giao dịch." });
  }
};

// 2. Lưu giao dịch mới (Hàm này bạn đang thiếu)
exports.createTransaction = async (req, res) => {
  // Frontend Home.js gửi: { userId, type, amount, categoryId, date, note }
  const { userId, categoryId, amount, date, note, type } = req.body;

  // Kiểm tra dữ liệu quan trọng
  if (!userId || !amount || !date) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin giao dịch (userId, amount, date)" });
  }

  try {
    // Gọi Model để insert vào Database
    // Lưu ý: Transaction.create phải được định nghĩa trong models/Transaction.js
    await Transaction.create(userId, categoryId, amount, date, note);

    res.status(201).json({ message: "Lưu giao dịch thành công" });
  } catch (error) {
    console.error("Lỗi lưu giao dịch:", error);
    res.status(500).json({ message: "Lỗi Server khi lưu giao dịch." });
  }
};
