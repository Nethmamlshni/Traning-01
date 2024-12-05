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
        type: Boolean,
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
});

const hotelRoomModel = mongoose.model("HotelRoom", hotelRoomSchema);

export default hotelRoomModel;