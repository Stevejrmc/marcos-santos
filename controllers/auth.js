import express from "express";
import { Accounts, Users } from "../models/index.js";

const router = express.Router();

const mockAuth = {
  isAuthenticated: false,
  isAuthorized: false,
};

const mockSession = {
  currentUser: null,
  isAdmin: false
};

// mock authorization
const checkAuth = (req, res, next) => {
  const { currentUser } = mockSession;
  const route = req.url.split("/")[1] || "home";
  let routeID = req.url.split("/")[2];
  if (routeID) {
    routeID = routeID.length > 1 ? routeID.charAt(0) : routeID;
  };
  let redirectRoute = "/";
  if (currentUser) {
    res.locals.currentUser = currentUser;
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
      case "auth":
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
      case "about":
      case "faqs":
      case "auth":
      case "home":
        mockAuth.isAuthorized = true;
        break;
      default:
        mockAuth.isAuthorized = false;
        break;
    }
  }
  res.locals.mockAuth = mockAuth;
  if (mockAuth.isAuthorized) {
    next();
  } else {
    res.redirect(redirectRoute);
  }
}

router.get("/signout");

router.post("/login", (req, res) => {
  Users.findOne({ email: req.body.loginEmail }).then(user => {
    // TODO: bcrypt check password hash
    if (user) {
      mockAuth.isAuthenticated = true;
      mockSession.currentUser = user;
      res.redirect(`/account/${user.userId}`);
    } else {
      res.locals.message = "Invalid username or password";
      res.redirect("/");
    }
  })
});

router.post("/register", (req, res) => {
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

const myAuth = { router, checkAuth };

export default myAuth;