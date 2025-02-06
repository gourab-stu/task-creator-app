import { fileURLToPath } from "url";
import { taskModel } from "./models/tasks.model.js"
import { userModel } from "./models/users.model.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";

dotenv.config({ path: "./production.env" });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
    try{
        if (!req.cookies.authToken) return res.redirect("/login");
        let email = jwt.verify(req.cookies.authToken, process.env.API_SECRET);
        const user = await userModel.findOne({ email });
        if (!user) return res.render("error", { message: "Invalid Authentication", url: "/login", instruction: "Login again" });
        const tasks = await taskModel.find({ _id: { $in: user.tasks } });
        res.render("index", { tasks });
    } catch (err) {
        return next(err);
    }
});

app.get("/login", (req, res) => {
    if (req.cookies.authToken) return res.redirect("/");
    res.render("login");
});

app.get("/logout", (req, res) => {
    if (!req.cookies.authToken) res.redirect("/");
    res.clearCookie("authToken").redirect("/");
});

app.get("/register", (req, res) => {
    if (req.cookies.authToken) return res.redirect("/");
    res.render("register");
});

app.post("/register/user/", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (await userModel.findOne({ email })) res.render("error", { message: "Email is already used by an existing user", url: "/register", instruction: "Use another email" });
        else {
            await userModel.create({ email, password: bcrypt.hashSync(password, 10) });
            res.redirect("/login");
        }
    } catch (err) {
        return next(err);
    }
});

app.post("/login/user/", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        let authToken = jwt.sign(email, process.env.API_SECRET);
        if (bcrypt.compareSync(password, user.password)) res.cookie("authToken", authToken).redirect("/");
        else res.render("error", { message: "Invalid credentials", url: "/login", instruction: "Try again" });
    } catch (err) {
        return next(err);
    } 
});

app.post("/create", async (req, res, next) => {
    try {
        let { title, details } = req.body;
        let task = await taskModel.create({ title, details });
        await userModel.updateOne({ email: jwt.verify(req.cookies.authToken, process.env.API_SECRET)}, { $push: { tasks: task.id } });
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
});

app.post("/update/:id", async (req, res) => {
    let { title, details } = req.body;
    await taskModel.updateOne({ _id: req.params.id }, { title, details });
    res.redirect("/");
});

app.get("/view/:id", async (req, res) => {
    const task = await taskModel.findOne({ _id: req.params.id });
    if (!task) res.render("error", { message: "Cannot find task", url: "/", instruction: "Go to homepage" });
    res.render("view", { task });
});

app.get("/delete/:id", async (req, res) => {
    await taskModel.deleteOne({ _id: req.params.id });
    await userModel.updateOne({ email: jwt.verify(req.cookies.authToken, process.env.API_SECRET) }, { $pull: { tasks: req.params.id } })
    res.redirect("/");
    
});

app.get("/edit/:id", async (req, res) => {
    const task = await taskModel.findOne({ _id: req.params.id });
    if (!task) res.render("error", { message: "Cannot find task", url: "/", instruction: "Go to homepage" });
    res.render("edit", { task });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", { message: err.message, url: "/", instruction: "Go to homepage" });
});

app.listen(process.env.PORT, () => {
    console.log(`Application server is running`);
    mongoose
        .connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}`)
        .then(() => {
            console.log("application server is connected to database server");
        })
        .catch((err) => {
            console.error(err);
        });
});