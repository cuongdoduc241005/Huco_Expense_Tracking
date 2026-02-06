const db = require("../config/db");

class Transaction {
  // 1. Tạo giao dịch mới
  static async create(userId, categoryId, amount, date, note) {
    const sql = `
      INSERT INTO TRANSACTIONS (USER_ID, CATEGORY_ID, TRANSACTION_AMOUNT, TRANSACTION_DATE, TRANSACTION_NOTE)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.execute(sql, [userId, categoryId, amount, date, note]);
  }

  // Xóa giao dịch
  static async delete(id) {
    const sql = `DELETE FROM TRANSACTIONS WHERE TRANSACTION_ID = ?`;
    return db.execute(sql, [id]);
  }

  // Cập nhật giao dịch
  static async update(id, categoryId, amount, date, note) {
    const sql = `
      UPDATE TRANSACTIONS 
      SET CATEGORY_ID = ?, TRANSACTION_AMOUNT = ?, TRANSACTION_DATE = ?, TRANSACTION_NOTE = ?
      WHERE TRANSACTION_ID = ?
    `;
    return db.execute(sql, [categoryId, amount, date, note, id]);
  }

  // 2. Lấy lịch sử giao dịch (Khớp cấu trúc Database mới)
  static async getByUserId(userId) {
    const sql = `
      SELECT 
        t.TRANSACTION_ID as id, 
        t.TRANSACTION_AMOUNT as amount, 
        t.TRANSACTION_NOTE as note, 
        t.TRANSACTION_DATE as date, 
        c.CATEGORY_NAME as category, 
        c.CATEGORY_TYPE as type, -- Lấy từ bảng Categories
        c.CATEGORY_ICON as icon, 
        c.CATEGORY_COLOR as color
      FROM TRANSACTIONS t
      JOIN CATEGORIES c ON t.CATEGORY_ID = c.CATEGORY_ID
      WHERE t.USER_ID = ?
      ORDER BY t.TRANSACTION_DATE DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  static async delete(id) {
    return db.execute("DELETE FROM TRANSACTIONS WHERE TRANSACTION_ID = ?", [
      id,
    ]);
  }

  static async getStats(userId, type, month, year) {
    // SỬA LẠI SQL: Gộp theo CATEGORY_ID và tính tổng số tiền (SUM)
    const pieSql = `
      SELECT 
        c.CATEGORY_ID as id, 
        c.CATEGORY_NAME as name, 
        c.CATEGORY_COLOR as color, 
        c.CATEGORY_ICON as icon,
        SUM(t.TRANSACTION_AMOUNT) as amount -- CỘNG TỔNG TIỀN
      FROM TRANSACTIONS t
      JOIN CATEGORIES c ON t.CATEGORY_ID = c.CATEGORY_ID
      WHERE t.USER_ID = ? 
        AND c.CATEGORY_TYPE = ?
        AND MONTH(t.TRANSACTION_DATE) = ? 
        AND YEAR(t.TRANSACTION_DATE) = ?
      GROUP BY c.CATEGORY_ID -- GỘP CHUNG DANH MỤC TẠI ĐÂY
      ORDER BY amount DESC
    `;

    // Đảm bảo truyền tham số month, year vào execute
    const [pieData] = await db.execute(pieSql, [
      userId,
      type,
      Number(month),
      Number(year),
    ]);
    return { pieData };
  }
}
module.exports = Transaction;
