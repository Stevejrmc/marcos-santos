import express from "express";
import * as dotenv from "dotenv";
import methodOverride from "method-override";
// TODO: Implement legit Auth
// import bcrypt from "bcrypt"
// import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import {
  admins as adminsRouter,
  accounts as accountsRouter,
  auth
} from "./controllers/index.js";

dotenv.config();
const { router: authRouter, checkAuth } = auth;
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = fileURLToPath(new URL('.', import.meta.url));
// const saltRounds = 10;
const mongoURI = "mongodb://localhost:27017/msantos";
mongoose.connect(mongoURI);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(checkAuth);

app.use("/account", accountsRouter);
app.use("/admin", adminsRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  // TODO: add flash messaging package
  res.locals.message ||= "";
  let { isAuthenticated } = res.locals.mockAuth;
  res.render("index", {
    message: res.locals.message,
    path: "home",
    isAuthenticated
  });
});


app.listen(PORT, () => console.log(`listening on port ${PORT}...`));