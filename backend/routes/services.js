import express from "express";
const router = express.Router();

// Example: static services
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "24/7 Customer Support" },
    { id: 2, name: "Instant Ticket Cancellation" },
    { id: 3, name: "Group Discounts" },
  ]);
});

export default router;
