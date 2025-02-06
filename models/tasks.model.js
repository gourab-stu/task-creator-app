import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        title: {
            type:String,
            required: true,
            trim: true
        },
        details: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

export const taskModel = mongoose.model("task", taskSchema);