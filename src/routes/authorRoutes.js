const express = require("express");

const {
  getAuthors,
  getAuthorById,
  createAuthor,
} = require("../controllers/authorController");

const router = express.Router();

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);

module.exports = router;