const express = require("express");
const User = require("../models/user-model");
const router = new express.Router();
const auth = require("../middleware/auth");

const maxAge = 1000 * 60 * 60 * 24 * 365 * 5;

router.post("/users/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res
      .status(201)
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge,
      })
      .cookie("isLoggedIn", true, { maxAge })
      .send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token !== req.token;
    });
    await req.user.save();
    res
      .cookie("jwt", "", { httpOnly: true })
      .cookie("isLoggedIn", false, { maxAge })
      .send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValid = update.every((element) => allowedUpdates.includes(element));

  if (!isValid)
    return res.status(400).send({ error: "Invalid update or not Allowed!" });
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    update.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
