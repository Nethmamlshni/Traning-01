import jwt from "jsonwebtoken";
import galleryModel from "../model/gallerItem.js";
import axios from "axios";

export function createGallery(req, res) {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing, authorization denied." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Check if the user has the 'admin' type
        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to create a gallery."
            });
        }

        // Proceed to create gallery item
        const galleryData = req.body;
        const newGallery = new galleryModel(galleryData);

        newGallery.save()
            .then((result) => {
                res.status(201).json({
                    message: "Gallery item created successfully",
                    result: result
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Error creating gallery item",
                    error: err.message
                });
            });
    } catch (error) {
        res.status(400).json({
            message: "Invalid or expired token.",
            error: error.message
        });
    }
}

export function deleteGallery(req, res) {
    try {
        // Verify token and user type
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);

        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to delete gallery items."
            });
        }

        const { name } = req.params;

        if (!name) {
            return res.status(400).json({ message: 'Gallery name is required' });
        }

        // Find and delete the gallery item by name
        galleryModel.findOneAndDelete({ name })
            .then((galleryItem) => {
                if (!galleryItem) {
                    return res.status(404).json({ message: 'Gallery item not found' });
                }
                res.json({
                    message: `Gallery item with name '${name}' deleted successfully`
                });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error deleting gallery item', error: err.message });
            });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token.", error: error.message });
    }
}

export async function showGalleries(req, res) {
    try {
        const galleries = await galleryModel.find();
        res.status(200).json(galleries);
    } catch (error) {
        console.error("Error fetching galleries:", error);
        res.status(500).json({ message: "Error fetching galleries" });
    }
}

export function updateGallery(req, res) {
    try {
        // Verify token and user type
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to update gallery items."
            });
        }

        const { name } = req.params;
        const updates = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Gallery name is required' });
        }

        // Find and update the gallery item by name
        galleryModel.findOneAndUpdate({ name }, updates, { new: true })
            .then((updatedGallery) => {
                if (!updatedGallery) { 
                    return res.status(404).json({ message: 'Gallery item not found' });
                }
                res.json({
                    message: `Gallery item with name '${name}' updated successfully`,
                    updatedGallery: updatedGallery
                });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error updating gallery item', error: err.message });
            });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token.", error: error.message });
    }
}