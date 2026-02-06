const User = require("../models/User");
const Category = require("../models/Category");

// --- XỬ LÝ ĐĂNG KÝ ---
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin (email, mật khẩu, tên)",
    });
  }

  try {
    // 1. Kiểm tra Email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng." });
    }

    // 2. Tạo User
    const [result] = await User.create(email, password, name);
    const newUserId = result.insertId;

    // 3. [QUAN TRỌNG] Copy danh mục từ Database sang cho User mới
    await Category.copyDefaults(newUserId);

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: newUserId,
    });
  } catch (error) {
    console.error("Lỗi Đăng Ký:", error);
    res.status(500).json({ message: "Lỗi Server khi xử lý đăng ký." });
  }
};

// --- XỬ LÝ ĐĂNG NHẬP ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập email và mật khẩu." });
  }

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại." });
    }

    // So sánh mật khẩu (Chú ý: Cột trong DB là USER_PASSWORD)
    if (user.USER_PASSWORD !== password) {
      return res.status(400).json({ message: "Mật khẩu không chính xác." });
    }

    // --- LOGIC TỰ ĐỘNG COPY DANH MỤC NẾU USER CHƯA CÓ ---
    // Giúp user cũ cập nhật danh sách mới mà không cần đăng ký lại
    const hasData = await Category.checkHasCategories(user.USER_ID);
    if (!hasData) {
      console.log(
        `User ID ${user.USER_ID} chưa có danh mục. Đang copy từ mẫu...`,
      );
      await Category.copyDefaults(user.USER_ID);
    }
    // -----------------------------------------------------

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        USER_ID: user.USER_ID,
        USER_NAME: user.USER_NAME,
        USER_EMAIL: user.USER_EMAIL,
      },
    });
  } catch (error) {
    console.error("Lỗi Đăng Nhập:", error);
    res.status(500).json({ message: "Lỗi Server." });
  }
};
