import hotelBookingModel from "../model/hotelBookingModel.js";
import hotelRoomModel from "../model/hotelRoomModel.js";
import userModel from '../model/userModel.js';
import jwt from "jsonwebtoken";
var BookingNumber=1000;
// Create a new booking
export function createBooking(req, res) {
    // Decode JWT token to get user details
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);

    // Check if the user has the 'user' type
    if (decoded.type !== "user") {
        return res.status(403).json({
            message: "First, you need to log in to your account."
        });
    }

    const { roomNumber, checkInDate, checkOutDate, totalPrice } = req.body;

    // Find the room by roomNumber
    hotelRoomModel.findOne({ roomNumber })
        .then((room) => {
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            if (!room.isAvailable) {
                return res.status(400).json({ message: "Room is not available for booking" });
            }

            // Increment BookingNumber
            

            // Create the booking with roomId, roomNumber, and userId
            const newBooking = new hotelBookingModel({
                roomId: room._id, // Save room ID
                roomNumber,       // Save room number for convenience
                userId: decoded.id, // Save user ID from decoded JWT
                checkInDate,
                checkOutDate,
                totalPrice:room.price
            });
            BookingNumber++;
            // Save the booking
            newBooking.save()
                .then((savedBooking) => {
                    // Fetch the user's name to include in the response
                    userModel.findById(decoded.id)
                        .then((user) => {
                            if (!user) {
                                return res.status(404).json({ message: "User not found" });
                            }

                            // Update the room to set it as unavailable
                            room.isAvailable = false;
                            room.save()
                                .then(() => {
                                    // Send response
                                    res.status(201).json({
                                        message: `Booking created successfully for user: ${user.name}`,
                                        booking: savedBooking,
                                        BookingNumber
                                    });
                                })
                                .catch((err) => res.status(500).json({ message: "Error updating room availability", error: err.message }));
                        })
                        .catch((err) => res.status(500).json({ message: "Error fetching user details", error: err.message }));
                })
                .catch((err) => res.status(500).json({ message: "Error creating booking", error: err.message }));
        })
        .catch((err) => res.status(500).json({ message: "Error finding room", error: err.message }));
}

// Get all bookings
export function getAllBookings(req, res) {
    hotelBookingModel.find()
        .populate({
            path: "roomId",
            select: "roomNumber type price",
        }) // Include room details
        .populate("userId", "name email") // Include user details
        .then((bookings) => {
            res.json(bookings); // Send response with bookings
        })
        .catch((err) => {
            console.error("Error fetching bookings:", err); // Log the detailed error
            res.status(500).json({ 
                message: "Error fetching bookings", 
                error: err.message,
                stack: err.stack // Optional: Include stack trace for debugging
            });
        });
}


// Get a specific booking by roomNumber
export function getBookingByRoomNumber(req, res) {
    const { roomNumber } = req.params;

    hotelRoomModel.findOne({ roomNumber })
        .then((room) => {
            if (!room) return res.status(404).json({ message: "Room not found" });

            hotelBookingModel.find({ roomId: room._id })
                .populate("roomId", "roomNumber type price")
                .populate("userId", "name email")
                .then((bookings) => {
                    if (!bookings.length) return res.status(404).json({ message: "No bookings found for this room" });
                    res.json(bookings);
                })
                .catch((err) => res.status(500).json({ message: "Error fetching bookings", error: err.message }));
        })
        .catch((err) => res.status(500).json({ message: "Error finding room", error: err.message }));
}
// Cancel a booking using roomNumber
export function cancelBookingByRoomNumber(req, res) {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);

    // Check if the user has the 'admin' type
    if (decoded.type !== "admin") {
        return res.status(403).json({ message: "You are not allowed to cancel bookings." });
    }

    const { roomNumber } = req.params;

    hotelRoomModel.findOne({ roomNumber })
        .then((room) => {
            if (!room) return res.status(404).json({ message: "Room not found" });

            hotelBookingModel.findOneAndUpdate(
                { roomId: room._id, status: { $ne: "Cancelled" } },
                { status: "Cancelled" },
                { new: true }
            )
                .then((updatedBooking) => {
                    if (!updatedBooking) return res.status(404).json({ message: "No active booking found for this room" });
                    res.json({ message: "Booking cancelled successfully", updatedBooking });
                })
                .catch((err) => res.status(500).json({ message: "Error cancelling booking", error: err.message }));
        })
        .catch((err) => res.status(500).json({ message: "Error finding room", error: err.message }));
}
