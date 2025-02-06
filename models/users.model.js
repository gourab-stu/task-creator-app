import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [ true, "password is required" ]
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "task"
            }
        ]
    },
    { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);