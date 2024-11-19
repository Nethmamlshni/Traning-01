import bodyParser from "body-parser";
import express from "express";
import userRouter from "./router/userRouter.js";
import galleryRouter from "./router/gallerRouter.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

app.use(bodyParser.json());
app.use ("/api/user", userRouter);
app.use ("/api/gallery", galleryRouter);


const connect ="mongodb+srv://nethmamalshani2002:1234_T01@cluster0.ldshf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secretkey", (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                req.user = decoded;
                console.log(decoded);
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
})
mongoose.connect(connect).then(() => {
    console.log("Database connected successfully"); 
   
}).catch((err) => {
    console.log(err);
})

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
});