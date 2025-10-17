import express from "express";
import Booking from "../models/Booking.js";


const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  const { route, date, seats } = req.body;

  const booking = await Booking.create({
    user: req.user._id,
    route,
    date,
    seats,
  });

  res.json(booking);
});

// Get all bookings for logged-in user
router.get("/", async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.json(bookings);
});

export default router;
