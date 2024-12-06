import Feedback from "../model/feedback.js";  // Assuming the model is here

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

// Admin approves feedback
export const approveFeedback = (id) => {
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in again.");
        return;
    }

    axios
        .put(`${import.meta.env.VITE_API_URL}api/feedback/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            alert("Feedback approved!");
            setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
        })
        .catch((err) => {
            console.error("Error approving feedback:", err);
            if (err.response?.status === 401) {
                alert("Unauthorized! Please log in again.");
            } else {
                alert("An error occurred while approving the feedback.");
            }
        });
};
