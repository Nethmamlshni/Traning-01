import hotelBookingModel from "../model/hotelBookingModel.js";
import hotelRoomModel from "../model/hotelRoomModel.js";

// Create a new booking
export function createBooking(req, res) {
    const { roomId, userId, checkInDate, checkOutDate, totalPrice } = req.body;

    // Check if the room is available
    hotelRoomModel.findById(roomId)
        .then((room) => {
            if (!room || !room.isAvailable) {
                return res.status(400).json({ message: "Room is not available for booking" });
            }

            const newBooking = new hotelBookingModel({ roomId, userId, checkInDate, checkOutDate, totalPrice });

            return newBooking.save()
                .then((booking) => res.status(201).json({ message: "Booking created successfully", booking }))
                .catch((err) => res.status(500).json({ message: "Error creating booking", error: err.message }));
        })
        .catch((err) => res.status(500).json({ message: "Error checking room availability", error: err.message }));
}

// Get all bookings
export function getAllBookings(req, res) {
    hotelBookingModel.find()
        .populate("roomId", "roomNumber type price") // Include room details
        .populate("userId", "name email") // Include user details
        .then((bookings) => res.json(bookings))
        .catch((err) => res.status(500).json({ message: "Error fetching bookings", error: err.message }));
}

// Get a specific booking by ID
export function getBookingById(req, res) {
    const { id } = req.params;

    hotelBookingModel.findById(id)
        .populate("roomId", "roomNumber type price")
        .populate("userId", "name email")
        .then((booking) => {
            if (!booking) return res.status(404).json({ message: "Booking not found" });
            res.json(booking);
        })
        .catch((err) => res.status(500).json({ message: "Error fetching booking", error: err.message }));
}

// Cancel a booking
export function cancelBooking(req, res) {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
    // Check if the user has the 'admin' type
    if (decoded.type !== "admin") {
        return res.status(403).json({
            message: "You are not allowed to create categories."
        });
    }
    const { id } = req.params;

    hotelBookingModel.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true })
        .then((updatedBooking) => {
            if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
            res.json({ message: "Booking cancelled successfully", updatedBooking });
        })
        .catch((err) => res.status(500).json({ message: "Error cancelling booking", error: err.message }));
}
