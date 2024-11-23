import hotelRoomModel from "../model/hotelRoomModel.js";
import jwt from "jsonwebtoken";

// Create a new hotel room
export const createRoom = (req, res) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
        // Check if the user has the 'admin' type
        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to create categories."
            });
        }
    const roomData = req.body;

    const newRoom = new hotelRoomModel(roomData);
    newRoom.save()
        .then((room) => {
            res.status(201).json({
                message: "Hotel room created successfully",
                room,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error creating hotel room",
                error: err.message,
            });
        });
};

// Get all hotel rooms
export const getRooms = (req, res) => {
    hotelRoomModel.find()
        .then((rooms) => {
            res.json(rooms);
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error fetching hotel rooms",
                error: err.message,
            });
        });
};

// Get a hotel room by room number
export const getRoomByNumber = (req, res) => {
    const { roomNumber } = req.params;

    hotelRoomModel.findOne({ roomNumber })
        .then((room) => {
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.json(room);
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error fetching hotel room",
                error: err.message,
            });
        });
};

// Update a hotel room by room number
export const updateRoom = (req, res) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
    // Check if the user has the 'admin' type
    if (decoded.type !== "admin") {
        return res.status(403).json({
            message: "You are not allowed to create categories."
        });
    }
    const { roomNumber } = req.params;
    const updates = req.body;

    hotelRoomModel.findOneAndUpdate({ roomNumber }, updates, { new: true })
        .then((updatedRoom) => {
            if (!updatedRoom) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.json({
                message: "Hotel room updated successfully",
                updatedRoom,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error updating hotel room",
                error: err.message,
            });
        });
};

// Delete a hotel room by room number
export const deleteRoom = (req, res) => {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
    // Check if the user has the 'admin' type
    if (decoded.type !== "admin") {
        return res.status(403).json({
            message: "You are not allowed to create categories."
        });
    }
    const { roomNumber } = req.params;

    hotelRoomModel.findOneAndDelete({ roomNumber })
        .then((deletedRoom) => {
            if (!deletedRoom) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.json({
                message: "Hotel room deleted successfully",
                deletedRoom,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error deleting hotel room",
                error: err.message,
            });
        });
};
