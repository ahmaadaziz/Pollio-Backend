const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "Anonymous",
  },
  email: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
