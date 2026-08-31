const pool = require("../db");

const getBorrowings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM borrowings
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch borrowings",
    });
  }
};

const getBorrowingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM borrowings WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Borrowing not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch borrowing",
    });
  }
};

const createBorrowing = async (req, res) => {
  try {
    const { user_id, book_copy_id } = req.body;

    const userResult = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const copyResult = await pool.query(
      "SELECT * FROM book_copies WHERE id = $1",
      [book_copy_id]
    );

    if (copyResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book copy not found",
      });
    }

    if (copyResult.rows[0].status !== "AVAILABLE") {
      return res.status(400).json({
        message: "Book copy is not available",
      });
    }

    const result = await pool.query(
      `INSERT INTO borrowings (
        user_id,
        book_copy_id,
        status,
        requested_at
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING *`,
      [user_id, book_copy_id, "PENDING"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Book copy already has an active borrowing",
      });
    }

    res.status(500).json({
      message: "Failed to create borrowing",
    });
  }
};

const approveBorrowing = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE borrowings
       SET status = 'BORROWED',
           approved_at = NOW(),
           borrowed_at = NOW(),
           due_date = NOW() + INTERVAL '30 days',
           updated_at = NOW()
       WHERE id = $1
         AND status = 'PENDING'
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Borrowing not found or not pending",
      });
    }

    await client.query(
      `UPDATE book_copies
       SET status = 'BORROWED',
           updated_at = NOW()
       WHERE id = $1`,
      [result.rows[0].book_copy_id]
    );

    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Failed to approve borrowing",
    });
  } finally {
    client.release();
  }
};

const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE borrowings
       SET status = 'RETURN_PENDING',
           return_requested_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
         AND status = 'BORROWED'
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Borrowing not found or not borrowed",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to request return",
    });
  }
};

const completeReturn = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE borrowings
       SET status = 'RETURNED',
           returned_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
         AND status = 'RETURN_PENDING'
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Borrowing not found or return not pending",
      });
    }

    await client.query(
      `UPDATE book_copies
       SET status = 'AVAILABLE',
           updated_at = NOW()
       WHERE id = $1`,
      [result.rows[0].book_copy_id]
    );

    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Failed to complete return",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  approveBorrowing,
  requestReturn,
  completeReturn,
};