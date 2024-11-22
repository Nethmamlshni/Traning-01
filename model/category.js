import mongoose from "mongoose";

const catageriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    feacuters: [
        {
            type:Array,
            required: true
        }
    ]
});

const catageriesModel = mongoose.model("catageries", catageriesSchema);

export default catageriesModel;