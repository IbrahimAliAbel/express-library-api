const express = require("express");

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);

module.exports = router;