import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    
});

const userModel = mongoose.model("user", userSchema);
export default userModel;