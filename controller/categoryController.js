import jwt from "jsonwebtoken";
import catageriesModel from "../model/category.js";

export function createCategory(req, res) {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        const token = authHeader.split(" ")[1]; // Assume format is "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "Token is missing, authorization denied." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Replace JWT_KEY with your secret key
       
        // Check if the user has the 'admin' type
        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to create categories."
            });
        }

        // Proceed to create category if user is an admin
        const category = req.body;
        const newCategory = new catageriesModel(category);
        

        newCategory.save()
            .then((result) => {
                res.status(201).json({
                    message: "Category created successfully",
                    result : result
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: err.message
                });
            });
    } catch (error) {
        res.status(400).json({
            message: "Invalid or expired token.",
            error: error.message
        });
    }
}


    
    // Delete category function
    export function deleteCategory(req, res) {
        const authenticate = (req, res, next) => {
            const token = req.header('Authorization')?.replace('Bearer ', '');
        
            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }
        
            try {
                const decoded = jwt.verify(token, process.env.JWT_KEY);  // Use your JWT secret key here
                req.user = decoded;  // Add the decoded user information to the request object
                next();  // Proceed to the next middleware
            } catch (err) {
                return res.status(400).json({ message: 'Invalid token' });
            }
        };
        
        // Middleware to check if the user is an admin
        const checkAdmin = (req, res, next) => {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ message: 'You do not have permission to delete categories.' });
            }
            next();  // Proceed if user is an admin
        };
        
        const { categoryId } = req.params;
    
        // Find and delete the category
        catageriesModel.findByIdAndDelete(categoryId)
            .then((category) => {
                if (!category) {
                    return res.status(404).json({ message: 'Category not found' });
                }
                // If category is deleted successfully
                console.log("Your request has been received");
                return res.json({
                    message: "Category deleted successfully"
                });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error deleting category', error: err.message });
            });
        }
        export function showCategories(req, res) {
            catageriesModel.find()
                .then((categories) => {
                    if (categories.length === 0) {
                        return res.status(404).json({ message: 'No categories found' });
                    }
                    res.json({
                        message: 'Categories retrieved successfully',
                        categories,
                    });
                })
                .catch((err) => {
                    res.status(500).json({ message: 'Error retrieving categories', error: err.message });
                });
        }