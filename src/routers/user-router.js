const express = require("express");
const User = require("../models/user-model");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).send({ newUser, success: "Yay user was saved" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
