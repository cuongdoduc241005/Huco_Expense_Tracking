const db = require("../config/db");

class Transaction {
  // Lấy tất cả giao dịch của 1 User
  static async getAll(userId) {
    const [rows] = await db.execute(
      `
      SELECT 
        t.TRANSACTION_ID as id,
        t.TRANSACTION_AMOUNT as amount,
        t.TRANSACTION_DATE as date,
        t.TRANSACTION_NOTE as note,
        c.CATEGORY_NAME as category,
        c.CATEGORY_TYPE as type,
        c.CATEGORY_ICON as icon,
        c.CATEGORY_COLOR as color
      FROM TRANSACTIONS t
      LEFT JOIN CATEGORIES c ON t.CATEGORY_ID = c.CATEGORY_ID
      WHERE t.USER_ID = ?
      ORDER BY t.TRANSACTION_DATE DESC
    `,
      [userId],
    );
    return rows;
  }

  // Tạo giao dịch mới
  static async create(userId, categoryId, amount, date, note) {
    return db.execute(
      `
      INSERT INTO TRANSACTIONS 
      (USER_ID, CATEGORY_ID, TRANSACTION_AMOUNT, TRANSACTION_DATE, TRANSACTION_NOTE) 
      VALUES (?, ?, ?, ?, ?)
    `,
      [userId, categoryId, amount, date, note],
    );
  }
}

module.exports = Transaction;
