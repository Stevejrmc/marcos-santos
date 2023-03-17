import express from "express";
import { Accounts } from "../models/index.js";

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

export default router;