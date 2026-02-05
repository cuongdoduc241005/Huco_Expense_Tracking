/**
 * --- ROUTE AUTH ---
 * Vai trò: Bản đồ chỉ đường cho các tính năng Xác thực.
 * Nhiệm vụ:
 * - Nếu người dùng gọi vào /register -> Chạy hàm register trong AuthController.
 * - Nếu người dùng gọi vào /login -> Chạy hàm login trong AuthController.
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
