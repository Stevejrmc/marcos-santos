const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();
const path = require("path");
const { admins: adminsRouter, accounts: accountsRouter } = require("./controllers");
const port = 3000;
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