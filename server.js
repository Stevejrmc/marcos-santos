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
  accounts as accountsRouter
} from "./controllers/index.js";
import { Accounts, Users } from "./models/index.js";


const mockAuth = {
  isAuthenticated: false,
  isAuthorized: false,
};

const mockSession = {
  currentUser: null,
  isAdmin: false
};
// TODO: Move to helper file
// middleware
const checkAuth = (req, res, next) => {
  const { currentUser } = mockSession;
  const route = req.url.split("/")[1] || "home";
  const routeID = req.url.split("/")[2];
  let redirectRoute = "/";
  if (currentUser) {
    res.locals.currentUser = currentUser;
    // TODO: mock authorization implementation
    // TODO: Remove log
    console.log("path: ", req.url.split("/"));
    let hasAuth = false;
    switch (route) {
      case "account":
        hasAuth = currentUser.userId == routeID;
        mockAuth.isAuthorized = hasAuth;
        redirectRoute = hasAuth ? redirectRoute : `/account/${currentUser.userId}`;
        break;
      case "admin":
        hasAuth = currentUser.isAdmin && routeID == currentUser.userId;
        mockAuth.isAuthorized = hasAuth;
        break;
      case "signout":
        mockAuth.isAuthenticated = false;
        mockAuth.isAuthorized = false;
        mockSession.currentUser = null;
        break;
      default:
        mockAuth.isAuthorized = true;
        break;
    }
  } else {
    switch (route) {
      case "services":
      case "prices":
      case "about":
      case "faqs":
      case "login":
      case "register":
      case "home":
        mockAuth.isAuthorized = true;
        break;
      default:
        mockAuth.isAuthorized = false;
        break;
    }
  }
  res.locals.mockAuth = mockAuth;
  // TODO: Remove log
  console.log(res.locals.mockAuth.isAuthenticated);
  if (mockAuth.isAuthorized) {
    next();
  } else {
    res.redirect(redirectRoute);
  }
}

dotenv.config();
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

// TODO: Move to an authentication router
app.get("/signout");

// TODO: Move to an authentication router
app.post("/login", (req, res) => {
  Users.findOne({ email: req.body.loginEmail }).then(user => {
    // TODO: bcrypt check password hash
    if (user) {
      mockAuth.isAuthenticated = true;
      mockSession.currentUser = user;
      // TODO: Remove log
      console.log("Successful login - auth: ", mockAuth);
      res.redirect(`/account/${user.userId}`);
    } else {
      res.locals.message = "Invalid username or password";
      res.redirect("/");
    }
  })
});

// TODO: Move to an authentication router
app.post("/register", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    country
  } = req.body;
  // TODO: move this check to script and block form submission
  if (confirmPassword != password) {
    res.locals.message = "Account not created. Passwords didn't match";
    res.redirect("/");
  } else {
    // TODO: replace count w/ uid package or similar
    Users.countDocuments().then((count, err) => {
      if (err) {
        res.locals.message = "Account not created. Database error. 1";
        res.redirect("/");
      } else {
        // TODO: bcrypt hash password
        const userId = count + 1;
        Users.create({
          firstName,
          lastName,
          email,
          password,
          country,
          userId
        }).then(user => {
          if (user) {
            mockAuth.isAuthenticated = true;
            mockSession.currentUser = user;
            Accounts.create({ userId }).then(account => {
              if (account) {
                res.redirect(`/account/${account.userId}`);
              } else {
                res.locals.message = "Account not created. Database error. 3";
                res.redirect("/");
              }
            })
          } else {
            res.locals.message = "Account not created. Database error. 2";
            res.redirect("/");
          }
        });
      }
    })
  }
})



app.listen(PORT, () => console.log(`listening on port ${PORT}...`));