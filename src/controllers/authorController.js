const pool = require("../db");

const getAuthors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM authors ORDER BY name ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch authors",
    });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM authors WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch author",
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const result = await pool.query(
      `INSERT INTO authors (name, bio)
       VALUES ($1, $2)
       RETURNING *`,
      [name, bio]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create author",
    });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
};