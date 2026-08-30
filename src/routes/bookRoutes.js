const express = require("express");
const {
  getBooks,
  getBookById,
  createBook,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);

module.exports = router;