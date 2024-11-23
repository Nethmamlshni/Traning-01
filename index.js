import bodyParser from "body-parser";
import express from "express";
import userRouter from "./router/userRouter.js";
import galleryRouter from "./router/gallerRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import hotelRoomRouter from "./router/hotelRoomRoutes.js";
import hotelBookingRoutes from "./router/hotelBookingRoutes.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use ("/api/user", userRouter);
app.use ("/api/gallery", galleryRouter);
app.use("/api/category", categoryRouter);
app.use("/api/hotelRoom", hotelRoomRouter);
app.use ("/api/hotelBooking", hotelBookingRoutes);



const connect = process.env.MONGO_URL;

app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_Key, (err, decoded) => {
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
});
app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
});