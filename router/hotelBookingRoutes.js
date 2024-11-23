import express from "express";
import { createBooking, getAllBookings, getBookingById, cancelBooking } from "../controller/hotelBookingController.js";

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get a booking by ID
router.get("/:id", getBookingById);

// Cancel a booking
router.put("/:id/cancel", cancelBooking);

export default router;
