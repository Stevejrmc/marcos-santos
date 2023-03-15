const express = require("express");
const router = express.Router();
const { Admins } = require("../models");

router.get("/", (req, res) => {
  res.send("Admins under construction");
});

module.exports = router;