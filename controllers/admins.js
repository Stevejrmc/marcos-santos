import express from "express";
import { Admins } from "../models/index.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admins under construction");
});

export default router;