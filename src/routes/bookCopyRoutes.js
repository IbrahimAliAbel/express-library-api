const express = require("express");

const {
  getBookCopies,
  getBookCopiesByBookId,
  getBookCopyById,
  createBookCopy,
  updateBookCopy,
  deleteBookCopy,
} = require("../controllers/bookCopyController");

const router = express.Router();

router.get("/", getBookCopies);
router.get("/book/:book_id", getBookCopiesByBookId);
router.get("/:id", getBookCopyById);
router.post("/", createBookCopy);
router.put("/:id", updateBookCopy);
router.delete("/:id", deleteBookCopy);

module.exports = router;