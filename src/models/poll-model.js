const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    trim: true,
  },
  options: [
    {
      index: Number,
      title: String,
      votes: Number,
    },
  ],
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
