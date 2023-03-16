import express from "express";
import { Accounts, Users } from "../models/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Accounts under construction");
})

export default router;