import Feedback from "../model/feedback.js"; 
import jwt from "jsonwebtoken";
import axios from "axios"; // Assuming the model is here

// Client submits feedback
export const submitFeedback = async (req, res) => {
    try {
        const { clientName, feedbackText } = req.body;
        const feedback = new Feedback({
            clientName,
            feedbackText,
            approved: false, // Initially, feedback is not approved
        });
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }
};
// Admin fetches all feedback
export const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedbacks", error: error.message });
    }
};

// Admin approves feedbac



export const approveFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify the admin token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token required." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Ensure only admins can approve feedback
        if (decoded.type !== "admin") {
            return res.status(403).json({ message: "Only admins can approve feedback." });
        }

        // Mark feedback as approved
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { approved: true },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        res.status(200).json({ message: "Feedback approved successfully.", feedback });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        res.status(500).json({ message: "Error approving feedback.", error: error.message });
    }
};

export const getApprovedFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ approved: true }); // Fetch only approved feedback
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved feedback.", error: error.message });
    }
};
