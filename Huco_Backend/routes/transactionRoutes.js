/**
 * --- ROUTE TRANSACTION ---
 * Vai trò: Bản đồ chỉ đường cho các tính năng Giao dịch.
 * Nhiệm vụ:
 * - Nhận các request liên quan đến lấy dữ liệu thu chi và chuyển cho TransactionController xử lý.
 */

const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Kiểm tra xem controller có load được không (Debug)
if (
  !transactionController.getTransactions ||
  !transactionController.createTransaction
) {
  console.error(
    "❌ LỖI: Không tìm thấy hàm trong transactionController. Kiểm tra lại file controller.",
  );
}

// Định nghĩa các route
// 1. Lấy danh sách giao dịch (GET /api/transactions?userId=...)
router.get("/", transactionController.getTransactions);

// 2. Tạo giao dịch mới (POST /api/transactions)
router.post("/", transactionController.createTransaction);

module.exports = router;
