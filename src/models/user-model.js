const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Poll = require("./poll-model");

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
        throw new Error("You're password cannot contain the word 'Password'");
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
  const token = jwt.sign({ _id: this._id.toString() }, "Yamete!Kudasai!");
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user)
    throw new Error({ message: "Unable to login check your credentials" });
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch)
    throw new Error({ message: "Unable to login check your credentials" });
};

//Encrypt Password Before Saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

//Remove all polls owned by a user before deleting the user
userSchema.pre("remove", async function (next) {
  await Poll.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
