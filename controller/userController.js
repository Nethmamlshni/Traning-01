import express from "express";
const userController=express.Router();
import bodyParser from "body-parser";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import nodemailer from "nodemailer";

userController.use(bodyParser.json());
export function getUser(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    if (!token) {
        return res.status(401).json({ message: "Token missing in Authorization header" });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ message: "Invalid token" });
        }

        userModel.findById(decoded.id) // Replace `decoded.id` with your payload structure
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json({ user: { name: user.name, img: user.img } });
            })
            .catch((err) => {
                console.error("Database error fetching user:", err);
                res.status(500).json({ message: "Internal server error" });
            });
    });
}



export function postUser(req, res) {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const newUser = new userModel({
                email,
                password: hashedPassword,
                ...rest,
            });

            return newUser.save();
        })
        .then(() => {
            res.json({ message: "User created successfully" });
        })
        .catch((err) => {
            console.error("Error creating user:", err); // Debugging info
            res.status(500).json({ message: "Error creating user", error: err.message });
        });
}

export function loginuser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return bcrypt.compare(password, user.password).then((isMatch) => {
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                const payload = { id: user._id, email: user.email, type: user.type };
                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

                res.json({ message: "User logged in successfully", user: payload, token });
            });
        })
        .catch((err) => {
            console.error("Login error:", err); // Debugging info
            res.status(500).json({ message: "Error finding user", error: err.message });
        });
    }

    export  function FogotPassword  (req, res) {
                const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: 'Email is required' });
        }
        
        // Validate user and send email
        const user =  User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      
        const resetToken = generateResetToken(); // Implement token generation
        const resetLink = `https://your-frontend-url.com/reset-password/${resetToken}`;
      
        try {
          transporter.sendMail({
            from: '"Your App" <no-reply@yourapp.com>',
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
          });
          res.json({ message: 'Password reset email sent' });
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        }
      };
      
      
      export  function resetPassword (req, res) {
        const { token, password } = req.body;
      
        if (!token || !password) {
          return res.status(400).json({ message: "Token and password are required" });
        }
      
        try {
          const decoded = jwt.verify(token, process.env.JWT_KEY);
          const hashedPassword =  bcrypt.hash(password, 10);
      
           userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
      
          res.json({ message: "Password reset successfully" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error resetting password" });
        }
      };
      