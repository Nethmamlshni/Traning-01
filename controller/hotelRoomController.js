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
    const savedRoom =  newRoom.save();
        res.status(201).json({
            success: true,
            message: "Hotel room created successfully",
            data: savedRoom,
        });
    
    if (err) {
        console.error("Error creating hotel room:", err); // Log backend error
        res.status(500).json({
            message: "Error creating hotel room",
            error: err.message,
        });
    }
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


// Function to fetch all rooms
export async function showRooms(req, res) {
    try {
      const rooms = await hotelRoomModel.find();
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Error fetching rooms" });
    }
  }

