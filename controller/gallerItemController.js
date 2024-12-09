/*import galleryModel from "../model/gallerItem.js";
import jwt from "jsonwebtoken";

// Create a new gallery item


// Get all gallery items
export function getgalleryItem(req, res) {
    console.log(req);
    galleryModel.find().then((galleryItems) => {
         res.json({
               galleryItems
         })
    }).catch((err) => {
         res.json({
               message: err
         })
    })
}

 export const createGalleryItem = async (req, res) => {
        try {
            // Check if the user is authenticated
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
    
            // Check if the user is an admin
            if (decoded.type == "admin") {
                return res.status(403).json({
                    message: "You do not have admin privileges to create a gallery item.",
                });
            }
    
            const galleryItemData = req.body;
    
            // Create a new gallery item in the database
            const newGalleryItem = new galleryModel(galleryItemData);
            const savedGalleryItem = await newGalleryItem.save();
    
            res.status(201).json({
                success: true,
                message: "Gallery item created successfully",
                data: savedGalleryItem,
            });
        } catch (error) {
            console.error("Error creating gallery item:", error);
            res.status(500).json({
                success: false,
                message: "Error creating gallery item",
                error: error.message,
            });
        }
    };

 export const updateGalleryItem = async (req, res) => {
        try {
            // Check if the user is authenticated
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
    
            // Check if the user is an admin
            if (decoded.type == "admin") {
                return res.status(403).json({
                    message: "You do not have admin privileges to update a gallery item.",
                });
            }
    
            const { name } = req.params;  // Get the gallery item ID from URL parameters
            const updates = req.body; 
           
    
            // Find and update the gallery item by name
            const updatedGalleryItem = await galleryModel.findOneAndUpdate({ name }, updates, { new: true });
    
            if (!updatedGalleryItem) {
                return res.status(404).json({
                    message: "Gallery item not found",
                });
            }
    
            res.status(200).json({
                success: true,
                message: "Gallery item updated successfully",
                data: updatedGalleryItem,
            });
        } catch (error) {
            console.error("Error updating gallery item:", error);
            res.status(500).json({
                success: false,
                message: "Error updating gallery item",
                error: error.message,
            });
        }
    }

// Delete a gallery item by name (Admin only)
export const deleteGalleryItem = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(" ")[1];

        // Decode the token to get user info
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Check if the user is an admin
        if (decoded.type == "admin") {
            return res.status(403).json({
                message: "You do not have admin privileges to delete a gallery item.",
            });
        }

        // Get the gallery item name from the URL parameters
        const { name } = req.params;

        // Try to delete the gallery item
        const deletedGalleryItem = await galleryModel.findOneAndDelete({ name });

        // If no item is found, return an error message
        if (!deletedGalleryItem) {
            return res.status(404).json({
                message: "Gallery item not found",
            });
        }

        // Send success response if deletion is successful
        res.json({
            success: true,
            message: "Gallery item deleted successfully",
            data: deletedGalleryItem,
        });
    } catch (error) {
        console.error("Error deleting gallery item:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting gallery item",
            error: error.message,
        });
    }
};*/

import jwt from "jsonwebtoken";
import galleryModel from "../model/gallerItem.js";

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
        if (decoded.type == "admin") {
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

        if (decoded.type == "admin") {
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
        // Fetch all gallery items from the database
        const galleries = await galleryModel.find();

        // Send the gallery items as a JSON response
        res.status(200).json(galleries);
    } catch (error) {
        console.error("Error fetching galleries:", error);

        // Send a 500 error response if something goes wrong
        res.status(500).json({ message: "Error fetching galleries" });
    }
}

export function updateGallery(req, res) {
    try {
        // Verify token and user type
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
        if (decoded.type == "admin") {
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