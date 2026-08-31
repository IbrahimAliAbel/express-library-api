const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);

module.exports = router;