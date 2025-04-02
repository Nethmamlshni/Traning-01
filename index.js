import express from "express";
import bodyParser from "body-parser";
import userRouter from "./router/userRouter.js";
import galleryRouter from "./router/gallerRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import hotelRoomRouter from "./router/hotelRoomRoutes.js";
import hotelBookingRoutes from "./router/hotelBookingRoutes.js";
import feedbackRouter from "./router/feedbackRouter.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://hotelsara-bice.vercel.app'],

  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/category", categoryRouter);
app.use("/api/hotelRoom", hotelRoomRouter);
app.use("/api/hotelBooking", hotelBookingRoutes);
app.use("/api/feedback", feedbackRouter);

// Authentication middleware for specific routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/secure')) {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, process.env.JWT_Key, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    next();
  }
});

// Database connection
const connect = process.env.MONGO_URL;
mongoose.connect(connect).then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.log(err);
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
