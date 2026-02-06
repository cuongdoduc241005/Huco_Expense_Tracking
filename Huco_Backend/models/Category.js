const db = require("../config/db");

class Category {
  // 1. LẤY DANH MỤC CỦA USER
  static async getAll(userId) {
    const [rows] = await db.execute(
      `SELECT 
        CATEGORY_ID as id,
        USER_ID as userId,
        CATEGORY_NAME as name,
        CATEGORY_TYPE as type,
        CATEGORY_ICON as icon,
        CATEGORY_COLOR as color
      FROM CATEGORIES 
      WHERE USER_ID = ?`,
      [userId],
    );
    return rows;
  }

  // 2. TẠO MỚI
  static async create(userId, name, type, icon, color) {
    return db.execute(
      `INSERT INTO CATEGORIES (USER_ID, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, name, type, icon, color],
    );
  }

  // 3. CẬP NHẬT
  static async update(id, userId, name, icon, color) {
    return db.execute(
      `UPDATE CATEGORIES 
       SET CATEGORY_NAME = ?, CATEGORY_ICON = ?, CATEGORY_COLOR = ?
       WHERE CATEGORY_ID = ? AND USER_ID = ?`,
      [name, icon, color, id, userId],
    );
  }

  // 4. XÓA
  static async delete(id, userId) {
    return db.execute(
      `DELETE FROM CATEGORIES WHERE CATEGORY_ID = ? AND USER_ID = ?`,
      [id, userId],
    );
  }

  // 5. KIỂM TRA TỒN TẠI
  static async checkHasCategories(userId) {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM CATEGORIES WHERE USER_ID = ?",
      [userId],
    );
    return rows[0].count > 0;
  }

  // 6. COPY TỪ MẪU (Dòng có USER_ID là NULL)
  static async copyDefaults(userId) {
    const sql = `
      INSERT INTO CATEGORIES (USER_ID, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR)
      SELECT ?, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR
      FROM CATEGORIES
      WHERE USER_ID IS NULL
    `;
    return db.query(sql, [userId]);
  }
}

module.exports = Category;
