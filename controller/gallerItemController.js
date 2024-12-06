import galleryModel from "../model/gallerItem.js";
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
};
