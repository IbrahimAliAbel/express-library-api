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

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    const result = await pool.query(
      `UPDATE authors
       SET name = $1,
           bio = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [name, bio, id]
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
      message: "Failed to update author",
    });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.json({
      message: "Author deleted successfully",
      author: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete author",
    });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};