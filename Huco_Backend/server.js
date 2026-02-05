require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HUCO BACKEND ĐANG CHẠY TẠI CỔNG ${PORT}...`);
});
