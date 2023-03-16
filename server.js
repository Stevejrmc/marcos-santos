import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import {
  admins as adminsRouter,
  accounts as accountsRouter
} from "./controllers/index.js";

const app = express();
const port = 3000;
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const mongoURI = "mongodb://localhost:27017/msantos";
mongoose.connect(mongoURI);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use("/account", accountsRouter);
app.use("/admin", adminsRouter);

app.get("/", (req, res) => {
  res.render("index");
});



app.listen(port, () => console.log(`listening on port ${port}...`));