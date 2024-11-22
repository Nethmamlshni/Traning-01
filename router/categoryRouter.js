import express from "express";
import bodyParser from "body-parser";
import { createCategory , showCategories } from "../controller/categoryController.js";
const categoryRouter=express.Router();
categoryRouter.use(bodyParser.json());

categoryRouter.post("/", createCategory);
categoryRouter.get("/", showCategories);




export default categoryRouter;