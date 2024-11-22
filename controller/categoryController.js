import catageriesModel from "../model/category.js";

export function createCategory(req, res) {
    // Check if the user is logged in
    if (req.user == null) {
        return res.json({
            message: "You are not logged in you"
        });
    }

    // Check if the user has the 'admin' type
    if (req.user.type !== "admin") {
        return res.json({
            message: "You are not allowed to create categories"
        });
    }

    // Proceed to create category if the user is logged in and is an admin
    const category = req.body;
    const newCategory = new catageriesModel(category);

    newCategory.save()
        .then(() => {
            res.json({
                message: "Category created successfully"
            });
        })
        .catch((err) => {
            res.json({
                message: err.message // Provide the error message
            });
        });
}


export function showCategories(req, res) {
    catageriesModel.find().then((categories) => {
        res.json({
            categories
        })
    }).catch((err) => {
        res.json({
            message: err
        })
    })
}