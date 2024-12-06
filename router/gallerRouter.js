import express from "express";
import bodyParser from "body-parser";
import {getgalleryItem,createGalleryItem, updateGalleryItem,deleteGalleryItem} from "../controller/gallerItemController.js";
const galleryRouter=express.Router();
galleryRouter.use(bodyParser.json());

galleryRouter.get("/", getgalleryItem);
galleryRouter.post("/", createGalleryItem);
galleryRouter.put("/:name", updateGalleryItem);
galleryRouter.delete("/:name", deleteGalleryItem);





export default galleryRouter;