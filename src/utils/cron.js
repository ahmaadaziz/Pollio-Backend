const Poll = require("../models/poll-model");
const CronJob = require("cron").CronJob;

const checkVoteTimeLimit = new CronJob("* * * * *", async () => {
  const currentDate = new Date.now();
  const polls = await Poll.find({ voteEnded: false });
  const expiredPolls = polls.map((poll) =>
    currentDate - poll.createdAt > 7
      ? (poll.voteEnded = true)
      : (poll.voteEnded = false)
  );
});

module.exports = checkVoteTimeLimit;
