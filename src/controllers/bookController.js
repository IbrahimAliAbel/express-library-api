const pool = require("../db");

const getBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

module.exports = {
  getBooks,
};