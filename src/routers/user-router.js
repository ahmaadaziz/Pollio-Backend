//NPM Imports
const express = require("express");

//JS Imports
const User = require("../models/user-model");

//Middleware
const auth = require("../middleware/auth");

//Express Imports
const router = new express.Router();

const maxAge = 1000 * 60 * 60 * 24 * 30;

//#region POST Routes

//Sign Up
router.post("/users/", async (req, res) => {
  const newUser = new User(req.body);
  const isTrue = req.cookies.isLoggedIn === "true";
  try {
    if (!isTrue) {
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res
        .status(201)
        .cookie("jwt", token, {
          httpOnly: true,
        })
        .cookie("isLoggedIn", true)
        .send(newUser);
    } else {
      throw { error: "Logout first to create a new account!" };
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//Login In
router.post("/users/login", async (req, res) => {
  try {
    const isTrue = req.cookies.isLoggedIn === "true";
    if (!isTrue) {
      const { email, password } = req.body;
      const rememberMe = req.body.rememberMe === "true";
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res
        .cookie("jwt", token, { httpOnly: true, ...(rememberMe && { maxAge }) })
        .cookie("isLoggedIn", true, { ...(rememberMe && { maxAge }) });
      res.send();
    } else {
      throw { error: "Already logged in" };
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Logout
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

//Logout from all devices
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

//#endregion

//#region GET Routes

//Get current user profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Get a user profile by Id
router.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//#endregion

//#region PATCH Routes

//Update current user profile
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

//#endregion

//#region DELETE Routes

//Delete current user profile
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//#endregion

module.exports = router;
