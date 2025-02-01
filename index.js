import { fileURLToPath } from "url";
import { taskModel } from "./models/tasks.model.js";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";

dotenv.config({ path: "./production.env" });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const tasks = await taskModel.find();
    res.render("index", { tasks: tasks });
});

app.post("/create", async (req, res) => {
    await taskModel.create({
        title: req.body.title,
        details: req.body.details
    });
    res.redirect("/");
});

app.post("/edit", async (req, res) => {
    await taskModel.updateOne({ title: req.body.oldTitle }, { title: req.body.newTitle, details: req.body.newDetails });
    res.redirect("/");
});

app.get("/view/:taskTitle", async (req, res) => {
    const task = await taskModel.findOne({ title: req.params.taskTitle.split(".").join(" ") });
    res.render("view", { task: task });
});

app.get("/delete/:taskTitle", async (req, res) => {
    await taskModel.deleteOne({ title: req.params.taskTitle.split(".").join(" ") });
    res.redirect("/");
    
});

app.get("/edit/:taskTitle", async (req, res) => {
    const task = await taskModel.findOne({ title: req.params.taskTitle.split(".").join(" ") });
    res.render("edit", {task: task });
});

app.listen(process.env.PORT || 2025, async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}`);
    } catch (err) {
        console.error(err);
    } finally {
        console.log(`Server is running on port ${process.env.PORT || 2025}`);
    }
});