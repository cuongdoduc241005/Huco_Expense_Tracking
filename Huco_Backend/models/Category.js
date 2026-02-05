const db = require("../config/db");

class Category {
  // 1. LẤY DANH MỤC (Chỉ lấy của User, không lấy danh mục gốc NULL nữa)
  static async getAll(userId) {
    const [rows] = await db.execute(
      `
      SELECT 
        CATEGORY_ID as id,
        USER_ID as userId,
        CATEGORY_NAME as name,
        CATEGORY_TYPE as type,
        CATEGORY_ICON as icon,
        CATEGORY_COLOR as color
      FROM CATEGORIES 
      WHERE USER_ID = ?
    `,
      [userId],
    );
    return rows;
  }

  // 2. TẠO MỚI
  static async create(userId, name, type, icon, color) {
    return db.execute(
      `
      INSERT INTO CATEGORIES (USER_ID, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR) 
      VALUES (?, ?, ?, ?, ?)
    `,
      [userId, name, type, icon, color],
    );
  }

  // 3. CẬP NHẬT (Chỉ cho phép sửa nếu đúng chủ sở hữu)
  static async update(id, userId, name, icon, color) {
    return db.execute(
      `
      UPDATE CATEGORIES 
      SET CATEGORY_NAME = ?, CATEGORY_ICON = ?, CATEGORY_COLOR = ?
      WHERE CATEGORY_ID = ? AND USER_ID = ?
    `,
      [name, icon, color, id, userId],
    );
  }

  // 4. XÓA (Chỉ cho phép xóa nếu đúng chủ sở hữu)
  static async delete(id, userId) {
    return db.execute(
      `
      DELETE FROM CATEGORIES 
      WHERE CATEGORY_ID = ? AND USER_ID = ?
    `,
      [id, userId],
    );
  }

  // 5. [QUAN TRỌNG] COPY DANH MỤC MẪU CHO USER MỚI
  static async copyDefaultsToUser(newUserId) {
    // Lấy tất cả danh mục có USER_ID là NULL -> Insert thành dòng mới với USER_ID = newUserId
    return db.execute(
      `
      INSERT INTO CATEGORIES (USER_ID, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR)
      SELECT ?, CATEGORY_NAME, CATEGORY_TYPE, CATEGORY_ICON, CATEGORY_COLOR
      FROM CATEGORIES
      WHERE USER_ID IS NULL
    `,
      [newUserId],
    );
  }
}

module.exports = Category;
