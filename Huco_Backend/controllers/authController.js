const User = require("../models/User");
const Category = require("../models/Category"); // <--- Import Model Category để copy danh mục

// --- XỬ LÝ ĐĂNG KÝ ---
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  // 1. Kiểm tra đầu vào
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({
        message: "Vui lòng nhập đầy đủ thông tin (email, mật khẩu, tên)",
      });
  }

  try {
    // 2. Kiểm tra xem Email đã tồn tại chưa
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng." });
    }

    // 3. Tạo User mới trong Database
    const [result] = await User.create(email, password, name);
    const newUserId = result.insertId;

    // 4. [QUAN TRỌNG] Sao chép danh mục mẫu (NULL) sang cho User mới này
    // Giúp User có sẵn danh mục để dùng, và có thể sửa/xóa thoải mái
    await Category.copyDefaultsToUser(newUserId);

    // 5. Trả về kết quả thành công
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

  // 1. Kiểm tra đầu vào
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập email và mật khẩu." });
  }

  try {
    // 2. Tìm User theo Email
    const user = await User.findByEmail(email);

    // 3. Kiểm tra User tồn tại
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email không tồn tại hoặc chưa đăng ký." });
    }

    // 4. Kiểm tra mật khẩu (Lưu ý: Trong thực tế nên dùng bcrypt để mã hóa, ở đây so sánh trực tiếp theo code hiện tại)
    // Giả sử cột mật khẩu trong DB là PASSWORD
    if (user.PASSWORD !== password) {
      return res.status(400).json({ message: "Mật khẩu không chính xác." });
    }

    // 5. Đăng nhập thành công -> Trả về thông tin User (trừ mật khẩu)
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
    res.status(500).json({ message: "Lỗi Server khi xử lý đăng nhập." });
  }
};
