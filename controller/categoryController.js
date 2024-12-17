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

export function deleteCategory(req, res) {
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
          
        // Check if the user has the 'admin' type
        if (decoded.type !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to create categories."
            });
        }
    const { name } = req.params;
   
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    // Find and delete the category by name
    catageriesModel.findOneAndDelete({ name })
        .then((category) => {
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({
                message: `Category '${name}' deleted successfully`,
            });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error deleting category', error: err.message });
        });
    }
          

    export async function showCategories(req, res) {
        try {
          // Fetch all categories from the database
          const categories = await catageriesModel.find();
      
          // Send the categories as a JSON response
          res.status(200).json(categories);
        } catch (error) {
          console.error("Error fetching categories:", error);
      
          // Send a 500 error response if something goes wrong
          res.status(500).json({ message: "Error fetching categories" });
        }
      }
      

export function updateCategory(req, res) {
    // Verify token and check user type
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);

    if (decoded.type !== "admin") {
        return res.status(403).json({
            message: "You are not allowed to update categories."
        });
    }

    const { name } = req.params;
    const updates = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    // Find and update the category by name
    catageriesModel.findOneAndUpdate({ name }, updates, { new: true })
        .then((category) => {
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({
                message: `Category '${name}' updated successfully`,
                updatedCategory: category,
            });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error updating category', error: err.message });
        });
}

