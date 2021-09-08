const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "anonymous",
  },
  email: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
