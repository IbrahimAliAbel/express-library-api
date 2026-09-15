const pool = require("../db");

const getBookCopies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM book_copies
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book copies",
    });
  }
};

const getBookCopiesByBookId = async (req, res) => {
  try {
    const { book_id } = req.params;

    const result = await pool.query(
      `SELECT bc.*
       FROM book_copies bc
       WHERE bc.book_id = $1
         AND bc.status = 'AVAILABLE'
         AND NOT EXISTS (
           SELECT 1
           FROM borrowings b
           WHERE b.book_copy_id = bc.id
             AND b.status IN ('PENDING', 'BORROWED', 'RETURN_PENDING')
         )
       ORDER BY bc.created_at ASC`,
      [book_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book copies by book",
    });
  }
};

const getBookCopyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM book_copies WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book copy not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book copy",
    });
  }
};

const createBookCopy = async (req, res) => {
  try {
    const { book_id, code, status } = req.body;

    const result = await pool.query(
      `INSERT INTO book_copies (book_id, code, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [book_id, code, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create book copy",
    });
  }
};

const updateBookCopy = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_id, code, status } = req.body;

    const result = await pool.query(
      `UPDATE book_copies
       SET book_id = $1,
           code = $2,
           status = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [book_id, code, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book copy not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update book copy",
    });
  }
};

const deleteBookCopy = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM book_copies WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book copy not found",
      });
    }

    res.json({
      message: "Book copy deleted successfully",
      book_copy: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete book copy",
    });
  }
};

module.exports = {
  getBookCopies,
  getBookCopiesByBookId,
  getBookCopyById,
  createBookCopy,
  updateBookCopy,
  deleteBookCopy,
};