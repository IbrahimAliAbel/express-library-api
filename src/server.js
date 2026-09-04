const express = require("express");
const pool = require("./db");
const bookRoutes = require("./routes/bookRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authorRoutes = require("./routes/authorRoutes");
const bookCopyRoutes = require("./routes/bookCopyRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express API is running!");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/books", bookRoutes);
app.use("/categories", categoryRoutes);
app.use("/authors", authorRoutes);
app.use("/book-copies", bookCopyRoutes);
app.use("/borrowings", borrowingRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});