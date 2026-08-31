const express = require("express");

const {
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  approveBorrowing,
  requestReturn,
  completeReturn,
} = require("../controllers/borrowingController");

const router = express.Router();

router.get("/", getBorrowings);
router.get("/:id", getBorrowingById);
router.post("/", createBorrowing);
router.put("/:id/approve", approveBorrowing);
router.put("/:id/request-return", requestReturn);
router.put("/:id/complete-return", completeReturn);
module.exports = router;