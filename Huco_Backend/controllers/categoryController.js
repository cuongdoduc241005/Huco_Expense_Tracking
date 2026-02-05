const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Thiếu UserId" });

  try {
    const categories = await Category.getAll(userId);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.createCategory = async (req, res) => {
  const { userId, name, type, icon, color } = req.body;
  if (!userId || !name || !type)
    return res.status(400).json({ message: "Thiếu thông tin" });

  try {
    const [result] = await Category.create(userId, name, type, icon, color);
    res.status(201).json({ message: "Tạo thành công", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { userId, name, icon, color } = req.body;

  try {
    const [result] = await Category.update(id, userId, name, icon, color);
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Không thể sửa (Hoặc không phải của bạn)" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // Cần userId để xác minh chủ sở hữu

  try {
    const [result] = await Category.delete(id, userId);
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Không thể xóa (Hoặc là danh mục hệ thống)" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};
