import express from "express";
import {createRoom,getRooms,getRoomByNumber,updateRoom,deleteRoom,} from "../controller/hotelRoomController.js";

const hotelRoomRouter = express.Router();

// Create a new hotel room
hotelRoomRouter.post("/", createRoom);

// Get all hotel rooms
hotelRoomRouter.get("/", getRooms);

// Get a hotel room by room number
hotelRoomRouter.get("/:roomNumber", getRoomByNumber);

// Update a hotel room by room number
hotelRoomRouter.put("/:roomNumber", updateRoom);

// Delete a hotel room by room number
hotelRoomRouter.delete("/:roomNumber", deleteRoom);

export default hotelRoomRouter;
