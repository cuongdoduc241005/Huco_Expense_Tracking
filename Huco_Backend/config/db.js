// Gọi thư viện
const mysql = require("mysql2");
require("dotenv").config();

// Khởi tạo một nhóm kết nối (connection pool)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnection: true, // Nếu tất cả kết nối đang bận, pool sẽ chờ thay vì báo lỗi
  connectionLimit: 10, // Số kết nối tối đa cùng lúc
  queueLimit: 0, // Nếu tất cả kết nối bận, queue request không giới hạn
});

// Xuất pool để sử dụng ở các file khác, hỗ trợ async/await
module.exports = pool.promise();
