const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title of the poll"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
    },
    options: {
      type: [
        {
          index: {
            type: Number,
            required: [true, "Please provide index number for options"],
          },
          title: {
            type: String,
            required: [true, "Please Provide Title of the option"],
            trim: true,
          },
          votes: {
            type: Number,
            required: [
              true,
              "Please provide number of votes. (0 incase the poll is being created)",
            ],
          },
        },
      ],
      validate(value) {
        if (value.length < 2) {
          throw new Error("Please Provide atleast 2 options");
        }
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Provide Id of Current User/Author"],
      ref: "User",
    },
    votedByInfo: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please Provide Id of Current User/Voter"],
          ref: "User",
        },
        choiceSeleted: {
          type: Number,
          required: [true, "Please Provide Index of the option selected"],
        },
      },
    ],
    voteEnded: {
      type: Boolean,
      required: true,
      default: false,
    },
    timeLimit: {
      type: String,
      required: [
        true,
        `Please provide time limit in the following string format - 
        (unit):(insert required number herer)

        Available units are: minute and day
        
        Example - minute:5 (Time limit is 5 minutes)`,
      ],
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
