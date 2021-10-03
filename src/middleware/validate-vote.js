const Poll = require("../models/poll-model");
const validateVote = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll.voteEnded) {
      const alreadyVoted = poll.votedByInfo.some(
        (e) => e.userId === req.params.user._id
      );
      if (alreadyVoted) {
        throw new Error("You have already Voted!");
      }
    } else {
      throw new Error("Voting has already Ended!");
    }
    req.poll = poll;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = validateVote;
