import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true, // Example: "Single", "Double", "Suite"
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: String,
        default: true
    },
    features: {
        type: [String], // Example: ["Sea View", "Air Conditioning"]
        default: []
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    }
});

const hotelRoomModel = mongoose.model("HotelRoom", hotelRoomSchema);

export default hotelRoomModel;