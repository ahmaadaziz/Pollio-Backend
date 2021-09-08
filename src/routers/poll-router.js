const express = require("express");
const Poll = require("../models/poll-model");

const router = new express.Router();

router.post("/polls", async (req, res) => {
  const newPoll = new Poll(req.body);
  try {
    await newPoll.save();
    res.status(201).send({ newPoll, success: "yay new poll created" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
