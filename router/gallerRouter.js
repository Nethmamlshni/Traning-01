import express from "express";
import bodyParser from "body-parser";
import {createGallery,deleteGallery, showGalleries,updateGallery} from "../controller/gallerItemController.js";
const galleryRouter=express.Router();
galleryRouter.use(bodyParser.json());

galleryRouter.get("/", showGalleries);
galleryRouter.post("/", createGallery);
galleryRouter.put("/:name", updateGallery);
galleryRouter.delete("/:name", deleteGallery);





export default galleryRouter;