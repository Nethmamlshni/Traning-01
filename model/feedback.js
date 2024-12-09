import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false, // Feedback starts as unapproved
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
