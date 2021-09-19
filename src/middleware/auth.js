const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const auth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (cookies.isLoggedIn) {
      const token = cookies.jwt;
      const decode = jwt.verify(token, "omaewomousinderu");
      const user = await User.findOne({
        _id: decode._id,
      });
      if (!user) throw new Error({ message: "User does not exist anymore" });
    }

    req.isLoggedIn = cookies.isLoggedIn;
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = auth;
