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

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book",
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
};