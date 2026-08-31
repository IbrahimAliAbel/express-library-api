const express = require("express");

const {
  getBookCopies,
  getBookCopyById,
  createBookCopy,
  updateBookCopy,
  deleteBookCopy,
} = require("../controllers/bookCopyController");

const router = express.Router();

router.get("/", getBookCopies);
router.get("/:id", getBookCopyById);
router.post("/", createBookCopy);
router.put("/:id", updateBookCopy);
router.delete("/:id", deleteBookCopy);

module.exports = router;