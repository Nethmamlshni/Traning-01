import express from "express";
import bodyParser from "body-parser";
import {getUser, postUser, loginuser} from "../controller/userController.js";
const userRouter=express.Router();
userRouter.use(bodyParser.json());

userRouter.get("/", getUser);
userRouter.post("/", postUser);
userRouter.post("/login", loginuser);




export default userRouter;
