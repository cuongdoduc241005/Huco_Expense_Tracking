/**
 * --- MODEL USER ---
 * Vai trò: Tương tác trực tiếp với bảng 'USERS' trong Database.
 * Nhiệm vụ:
 * 1. Chứa các câu lệnh SQL (SELECT, INSERT) liên quan đến người dùng.
 * 2. Không xử lý logic (như check pass sai hay đúng), chỉ lấy dữ liệu thô.
 */

const db = require("../config/db");

class User {
  // Tìm thông tin user dựa vào Email
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM USERS WHERE USER_EMAIL = ?",
      [email],
    );
    return rows[0];
  }

  // Tạo mới một user vào database
  static async create(userName, email, password) {
    return db.execute(
      "INSERT INTO USERS (USER_NAME, USER_PASSWORD, USER_EMAIL) VALUES (?, ?, ?)",
      [userName, password, email],
    );
  }

  // Tìm user khớp cả Email và Password (dùng cho Login cũ)
  static async findByCredentials(email, password) {
    const [rows] = await db.execute(
      "SELECT USER_ID, USER_NAME FROM USERS WHERE USER_EMAIL = ? AND USER_PASSWORD = ?",
      [email, password],
    );
    return rows[0];
  }
}

module.exports = User;
