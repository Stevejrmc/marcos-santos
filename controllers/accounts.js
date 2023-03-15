const express = require("express");
const router = express.Router();
const { Accounts, Users } = require("../models");

router.get("/", (req, res) => {
  res.send("Accounts under construction");
})

module.exports = router;