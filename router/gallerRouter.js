import express from "express";
import bodyParser from "body-parser";
import {getgalleryItem, postgalleryItem, deletegalleryItem} from "../controller/gallerItemController.js";
const galleryRouter=express.Router();
galleryRouter.use(bodyParser.json());

galleryRouter.get("/", getgalleryItem);
galleryRouter.post("/", postgalleryItem);
galleryRouter.delete("/", deletegalleryItem);




export default galleryRouter;