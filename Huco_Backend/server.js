const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Cho phép iPhone kết nối tới máy tính qua Wi-Fi
app.use(express.json()); // Cho phép server đọc dữ liệu JSON gửi từ App

// --- API ĐĂNG KÝ (Register) ---
app.post("/api/register", async (req, res) => {
  // Lấy userName, email, password từ App gửi lên.
  // userName ở đây chính là dữ liệu từ ô "Họ và tên" trên giao diện của bạn.
  const { userName, email, password } = req.body;

  try {
    // 1. Kiểm tra xem email đã tồn tại chưa
    const [existingUser] = await db.execute(
      "SELECT * FROM USERS WHERE USER_EMAIL = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email này đã được sử dụng." });
    }

    // 2. Lưu người dùng mới vào bảng USERS
    // Đã sửa lỗi: Số lượng cột (3 cột) khớp chính xác với số lượng giá trị truyền vào
    const [result] = await db.execute(
      "INSERT INTO USERS (USER_NAME, USER_PASSWORD, USER_EMAIL) VALUES (?, ?, ?)",
      [userName, password, email]
    );

    res
      .status(201)
      .json({ message: "Đăng ký thành công!", userId: result.insertId });
  } catch (error) {
    console.error("Lỗi Register:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký." });
  }
});

// --- API ĐĂNG NHẬP (Login) ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng theo email và mật khẩu
    // Đã sửa đổi để lấy USER_NAME thay cho USER_FULL_NAME để khớp với bảng mới của bạn
    const [users] = await db.execute(
      "SELECT USER_ID, USER_NAME FROM USERS WHERE USER_EMAIL = ? AND USER_PASSWORD = ?",
      [email, password]
    );

    if (users.length > 0) {
      res.status(200).json({
        message: "Đăng nhập thành công",
        user: users[0],
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không chính xác." });
    }
  } catch (error) {
    console.error("Lỗi Login:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập." });
  }
});

// --- API LẤY LỊCH SỬ GIAO DỊCH (Recent) ---
app.get("/api/transactions", async (req, res) => {
  try {
    // Lấy giao dịch kèm thông tin icon/màu từ bảng CATEGORIES
    const [rows] = await db.execute(`
      SELECT 
        t.TRANSACTION_ID as id,
        t.TRANSACTION_AMOUNT as amount,
        t.TRANSACTION_DATE as date,
        t.TRANSACTION_NOTE as note,
        c.CATEGORY_NAME as category,
        c.CATEGORY_TYPE as type,
        c.CATEGORY_ICON as icon,
        '#1F41BB' as color 
      FROM TRANSACTIONS t
      LEFT JOIN CATEGORIES c ON t.CATEGORY_ID = c.CATEGORY_ID
      ORDER BY t.TRANSACTION_DATE DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy giao dịch:", error);
    res.status(500).json({ message: "Không thể lấy dữ liệu giao dịch." });
  }
});

// Khởi động server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`------------------------------------------`);
  console.log(`HUCO BACKEND ĐANG CHẠY...`);
  console.log(`Địa chỉ local: http://localhost:${PORT}`);
  console.log(`Địa chỉ cho iPhone: http://192.168.100.145:${PORT}`);
  console.log(`------------------------------------------`);
});
