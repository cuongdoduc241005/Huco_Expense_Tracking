const Transaction = require("../models/Transaction");

// Thêm giao dịch
exports.addTransaction = async (req, res) => {
  const { userId, categoryId, amount, date, note } = req.body;
  try {
    await Transaction.create(userId, categoryId, amount, date, note);
    res.status(201).json({ message: "Lưu giao dịch thành công!" });
  } catch (error) {
    console.error("Lỗi Controller Add:", error);
    res.status(500).json({ message: "Lỗi Server không thể lưu" });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.delete(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { categoryId, amount, date, note } = req.body;
  try {
    await Transaction.update(id, categoryId, amount, date, note);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Lấy lịch sử
exports.getTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await Transaction.getByUserId(userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Lỗi lấy giao dịch:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.getStats = async (req, res) => {
  const { userId } = req.params;
  // Lấy các tham số lọc từ URL: ?type=...&month=...&year=...
  const { type, month, year } = req.query;

  try {
    const stats = await Transaction.getStats(userId, type, month, year);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Lỗi Controller Stats:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
