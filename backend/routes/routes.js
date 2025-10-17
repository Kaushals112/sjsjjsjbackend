import express from "express";
import Route from "../models/Route.js";

const router = express.Router();

// Get all routes
router.get("/", async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

export default router;
