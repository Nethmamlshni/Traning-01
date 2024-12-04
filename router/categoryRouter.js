import express from "express";
import bodyParser from "body-parser";
import { createCategory , showCategories,deleteCategory , updateCategory} from "../controller/categoryController.js";
const categoryRouter=express.Router();
categoryRouter.use(bodyParser.json());

categoryRouter.post("/", createCategory);
categoryRouter.delete("/:name", deleteCategory);
categoryRouter.put("/:name", updateCategory);
categoryRouter.get("/", showCategories);




export default categoryRouter;