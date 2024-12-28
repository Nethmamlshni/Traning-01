import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Cancelled"] },
    createdAt: { type: Date, default: Date.now },
    notes: { type: String },
    time: { type: Date, default: Date.now },
    category: { type: String, required: true },
    roomType: { type: String, required: true },
});

const hotelBookingModel = mongoose.model("HotelBooking", hotelBookingSchema);

export default hotelBookingModel;