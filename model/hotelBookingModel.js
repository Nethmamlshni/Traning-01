import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "HotelRoom", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Cancelled"] },
    createdAt: { type: Date, default: Date.now },
    notes: { type: String },
    time: { type: Date, default: Date.now }
});

const hotelBookingModel = mongoose.model("HotelBooking", hotelBookingSchema);

export default hotelBookingModel;
