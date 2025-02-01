import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        title: String,
        details: String
    },
    { timestamps: true }
);

export const taskModel = mongoose.model("task", taskSchema);