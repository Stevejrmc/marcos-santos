import express from "express";
import { Accounts, Users } from "../models/index.js";

const router = express.Router();
const PATH = "accounts";

router.get("/:id", (req, res) => {
  Accounts.findOne({ userId: req.params.id }).then(account => {
    if (account) {
      res.locals.account = account;
      res.locals.message ||= "";
      const { isAuthenticated } = res.locals.mockAuth;
      const { currentUser, message } = res.locals;
      console.log("user: ", currentUser);
      res.render("index", {
        account,
        user: currentUser,
        path: PATH,
        message: message,
        isAuthenticated
      });
    } else {
      res.locals.message = "404: Account not found";
      res.redirect("/");
    }
  })
});

router.delete("/:id", (req, res) => {
  Users.findOneAndDelete({ userId: req.params.id }).then(success => {
    if (success) {
      Accounts.findOneAndDelete({ userId: req.params.id }).then(success => {
        if (success) {
          // TODO: Properly update auth and redirect to home
          res.redirect("/auth/signout");
        } else {
          res.send("Error occurred");
        }
      });
    } else {
      res.send("Error occurred");
    }
  });
});

export default router;