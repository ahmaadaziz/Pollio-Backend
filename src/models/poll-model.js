const mongoose = require("mongoose");

// const optionsSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   value: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
// });

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
