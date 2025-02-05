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
    res.render("index", { tasks });
});

app.post("/create", async (req, res) => {
    let { title, details } = req.body;
    await taskModel.create({ title, details });
    res.redirect("/");
});

app.post("/update/:id", async (req, res) => {
    let { title, details } = req.body;
    await taskModel.updateOne({ _id: req.params.id }, { title, details });
    res.redirect("/");
});

app.get("/view/:id", async (req, res) => {
    const task = await taskModel.findOne({ _id: req.params.id });
    res.render("view", { task });
});

app.get("/delete/:id", async (req, res) => {
    await taskModel.deleteOne({ _id: req.params.id });
    res.redirect("/");
    
});

app.get("/edit/:id", async (req, res) => {
    const task = await taskModel.findOne({ _id: req.params.id });
    res.render("edit", { task });
});

app.listen(process.env.PORT || 2025, () => {
    console.log(`Application server is running on port ${process.env.PORT || 2025}`);
    mongoose
        .connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}`)
        .then(() => {
            console.log("application server is connected to database server");
        })
        .catch((err) => {
            console.error(err);
        });
});