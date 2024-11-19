import galleryModel from "../model/gallerItem.js";

export function postgalleryItem(req, res) {
    const galleryItem = req.body;

    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Please log in to create a gallery item." });

    }

    // Check if the user is an admin
    if (req.user.type !== "admin") {
        return res.status(403).json({ message: "You do not have admin privileges." });
    }

    // Log the gallery item data
    console.log(galleryItem);

    // Create a new gallery item
    const newGalleryItem = new galleryModel(galleryItem);
    newGalleryItem
        .save()
        .then(() => {
            res.status(201).json({
                message: "Gallery item created successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "An error occurred while creating the gallery item",
                error: err,
            });
        });
}


export function getgalleryItem(req, res) {
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

export function deletegalleryItem(req, res) {
     console.log("Your request has been received");
     res.json({
          message: "galleryItem deleted successfully"
     })
}