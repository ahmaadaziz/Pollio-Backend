//NPM Imports
const express = require("express");

//JS Imports
const Poll = require("../models/poll-model");

//Middleware
const validateVote = require("../middleware/validate-vote");
const auth = require("../middleware/auth");

//Express Imports
const router = new express.Router();

router.post("/polls", auth, async (req, res) => {
  const newPoll = new Poll({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await newPoll.save();
    res.status(201).send({ newPoll });
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

router.get("/polls/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) throw { error: "Poll not Found!" };
    res.send(poll);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("polls/vote/:id/:choice", auth, validateVote, async (req, res) => {
  try {
    const choiceIndex = req.poll.options.findIndex(
      (e) => e.index === req.params.choice
    );
    req.poll.options[choiceIndex].votes =
      req.poll.options[choiceIndex].votes + 1;
    req.poll.votedByInfo.push({
      userId: req.user._id,
      choiceSeleted: req.params.choice,
    });
    await req.poll.save();
  } catch (error) {}
});

router.delete("/polls/:id", auth, async (req, res) => {
  try {
    const poll = await Poll.findByIdAndRemove(req.params.id);
    if (!poll) return res.status(404).send({ error: "Poll not found!" });
    res.send({ message: "Poll was successfully THANOS snaped!" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
