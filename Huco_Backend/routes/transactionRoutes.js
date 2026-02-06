const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// 1. Route tạo mới
router.post("/", transactionController.addTransaction);

// 2. Route Thống kê
router.get("/stats/:userId", transactionController.getStats);

// 3. Route Sửa & Xóa
router.put("/:id", transactionController.updateTransaction); // Cập nhật theo ID
router.delete("/:id", transactionController.deleteTransaction); // Xóa theo ID

// 4. Route lấy danh sách
router.get("/:userId", transactionController.getTransactions);

module.exports = router;
