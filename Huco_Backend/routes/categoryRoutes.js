const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory); // API Sửa
router.delete("/:id", categoryController.deleteCategory); // API Xóa

module.exports = router;
