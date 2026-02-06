const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  const { userId } = req.query;
  try {
    const categories = await Category.getAll(userId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.createCategory = async (req, res) => {
  const { userId, name, type, icon, color } = req.body;
  try {
    const [result] = await Category.create(userId, name, type, icon, color);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { userId, name, icon, color } = req.body;
  try {
    await Category.update(id, userId, name, icon, color);
    res.json({ message: "Thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // Quan trọng: Nhận userId từ body
  try {
    await Category.delete(id, userId);
    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};
