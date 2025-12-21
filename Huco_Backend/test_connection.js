// Gọi file db.js vừa viết
const db = require("./config/db");

async function testDatabase() {
  try {
    console.log("⏳ Đang thử kết nối đến MySQL...");

    // Chạy thử một câu lệnh SQL siêu đơn giản (1 + 1 = ?)
    const [rows] = await db.query("SELECT 1 + 1 AS ket_qua");

    console.log("✅ KẾT NỐI THÀNH CÔNG!");
    console.log("👉 Database phản hồi kết quả: 1 + 1 =", rows[0].ket_qua);

    // Thử lấy danh sách User luôn xem sao (nếu đã chạy SQL tạo bảng rồi)
    const [users] = await db.query("SELECT * FROM USERS");
    console.log(`📋 Tìm thấy ${users.length} người dùng trong bảng USERS.`);
  } catch (error) {
    console.error("❌ KẾT NỐI THẤT BẠI RỒI!");
    console.error("Lỗi chi tiết:", error.message);
  } finally {
    process.exit(); // Test xong thì tắt chương trình
  }
}

testDatabase();
