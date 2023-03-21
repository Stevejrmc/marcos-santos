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

router.get("/:id/edit", (req, res) => {
  Accounts.findOne({ userId: req.params.id }).then(account => {
    if (account) {
      res.locals.message ||= "";
      const {
        currentUser: user,
        isAuthenticated,
        message
      } = res.locals;
      res.render("index", {
        path: "edit",
        account,
        user,
        isAuthenticated,
        message
      });
    }
  })
});

router.put("/:id", (req, res) => {
  Accounts.findOneAndUpdate({ userId: req.params.id }, { profile: req.body }).then(success => {
    if (success) {
      res.redirect(`/account/${req.params.id}`);
    } else {
      res.send("Error occurred");
    }
  });
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