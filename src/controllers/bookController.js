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

const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      isbn,
      publisher,
      published_year,
      cover_url,
      category_id,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO books
        (title, description, isbn, publisher, published_year, cover_url, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description,
        isbn,
        publisher,
        published_year,
        cover_url,
        category_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create book",
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
};