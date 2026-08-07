import mongoose from "mongoose";
import './right-model.js'

const roleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        enum: ["customer", "cook", "delivery", "admin"],
        unique: true
    },
    description:{
        type: String,
        default: ""
    },
    rights:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Right"
    }],
    isSystemRole: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const roleModel = mongoose.model("roles", roleSchema);