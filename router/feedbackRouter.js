import express from "express";
import bodyParser from "body-parser";
import { submitFeedback,getFeedbacks,approveFeedback ,getApprovedFeedbacks} from "../controller/feedbackController.js";
const feedbackRouter=express.Router();
feedbackRouter.use(bodyParser.json());

feedbackRouter.post("/", submitFeedback);
feedbackRouter.get("/", getFeedbacks);
feedbackRouter.put("/:id", approveFeedback);
feedbackRouter.get("/approved", getApprovedFeedbacks);



export default feedbackRouter;