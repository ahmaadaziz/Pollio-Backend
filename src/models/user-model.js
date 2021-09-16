const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide Username"],
  },
  email: {
    type: String,
    required: [true, "Please provide Email Address"],
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address!");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minlength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("You're password cannot contain the work 'Password'");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("polls", {
  ref: "Poll",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "XÆA-Xii");
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async function () {};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
