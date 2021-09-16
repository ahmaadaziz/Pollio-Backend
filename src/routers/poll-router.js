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

router.get("/polls", async (req, res) => {
  try {
    const polls = await Poll.find({});
    res.send(polls);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("polls/vote/:id/:choice", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  const choiceIndex = poll.options.findIndex(
    (e) => e.index === req.params.choice
  );
  poll.options[choiceIndex].votes = poll.options[choiceIndex].votes + 1;
  await poll.save();
});

router.delete("/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send({ error: "Poll not found!" });
    res.send({ message: "Poll was successfully THANOS snaped!" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
