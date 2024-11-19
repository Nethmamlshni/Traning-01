import express from "express";
const userController=express.Router();
import bodyParser from "body-parser";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


userController.use(bodyParser.json());
export function getUser(req, res) {
    userModel.find().then((users) => {
        res.json({
            users
        })
    }).catch((err) => {
        res.json({
            message: err
        })
    })
}

/*export function postUser(req, res) {
    const user=req.body;
    console.log(user);
    const password=req.body.password;
    const passwordhash=bcrypt.hashSync(password, 10);
    user.password=passwordhash;
    console.log(passwordhash);
    const newUser=new userModel(user);
    newUser.save().then(() => {
        res.json({
            message: "User created successfully"
        })
    }).catch((err) => {
        res.json({
            message: err
        })
    })
    
   
}*/


export function postUser(req, res) {
    const user = req.body;
    const password = user.password;

    // Hash the password asynchronously
    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            user.password = hashedPassword; // Replace the password with the hashed version
            const newUser = new userModel(user);

            return newUser.save();
        })
        .then(() => {
            res.json({
                message: "User created successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
}




export function deleteUser(req, res) {
    console.log("Your request has been received");
    res.json({
        message: "User deleted successfully"
    })

}

/*export function loginuser(req, res) {
    const cedintial = req.body;
    const passwordhash=bcrypt.hashSync(cedintial.password, 10);

    if (cedintial.email && cedintial.passwordhash) {
        userModel.findOne(cedintial).then((user) => {
            if (user) {
                const payload = {
                    id: user._id,
                    email: user.email,
                };

                // Generate a JWT token
                const token = jwt.sign(payload, "secretkey");

                res.json({
                    message: "User logged in successfully",
                    user: payload, // Sending back the payload (optional)
                    token: token,
                })
            } else {

                res.json({
                    message: "User not found"
                    
                })
            }
        })
    }
}*/


export function loginuser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    // Find user by email
    userModel.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            // Compare the entered password with the stored hashed password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(401).json({
                            message: "Invalid credentials",
                        });
                    }

                    // Generate JWT token
                    const payload = {
                        id: user._id,
                        email: user.email,
                    };

                    const token = jwt.sign(payload, "secretkey", { expiresIn: "1h" });

                    res.json({
                        message: "User logged in successfully",
                        user: payload,
                        token,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: "Error comparing passwords",
                        error: err.message,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error finding user",
                error: err.message,
            });
        });
}



