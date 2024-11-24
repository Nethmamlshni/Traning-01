import express from "express";
import { createBooking, getAllBookings,  getBookingByRoomNumber, cancelBookingByRoomNumber } from "../controller/hotelBookingController.js";

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get a booking by ID
router.get("/:roomNumber",  getBookingByRoomNumber);

// Cancel a booking
router.put("/:roomNumber/cancel", cancelBookingByRoomNumber);



export default router;
