//NPM Imports
const express = require("express");

//JS Imports
const User = require("../models/user-model");

//Middleware
const auth = require("../middleware/auth");

//Express Imports
const router = new express.Router();

const maxAge = 1000 * 60 * 60 * 24 * 365 * 5;

//POST Routes
router.post("/users/", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res
      .status(201)
      .cookie("jwt", token, {
        httpOnly: true,
      })
      .cookie("isLoggedIn", true)
      .send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const isTrue = req.cookies.isLoggedIn === "true";
    if (!isTrue) {
      const { email, password, rememberMe } = req.body;
      const user = await User.findByCredentials(email, password);
      console.log(user);
      const token = await user.generateAuthToken();
      res
        .cookie("jwt", token, { httpOnly: true, ...(rememberMe && { maxAge }) })
        .cookie("isLoggedIn", true, { ...(rememberMe && { maxAge }) });
      res.send();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token !== req.token;
    });
    await req.user.save();
    res.cookie("jwt", "", { httpOnly: true }).cookie("isLoggedIn", false);
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.cookie("jwt", "", { httpOnly: true }).cookie("isLoggedIn", false);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET Routes
router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//PATCH Routes
router.patch("/users/me", auth, async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValid = update.every((element) => allowedUpdates.includes(element));

  if (!isValid)
    return res.status(400).send({ error: "Invalid update or not Allowed!" });
  try {
    update.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//DELETE Routes
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
