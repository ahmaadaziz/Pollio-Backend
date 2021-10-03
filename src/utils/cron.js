const Poll = require("../models/poll-model");
const CronJob = require("cron").CronJob;
const dayjs = require("dayjs");

const checkVoteTimeLimit = new CronJob("* * * * *", async function () {
  try {
    const polls = await Poll.find({ voteEnded: false });
    if (!polls) throw new Error("Invalid search or no polls found!");
    polls.forEach((poll) => {
      const condition = poll.timeLimit.split(":");
      const check = dayjs().diff(poll.createdAt, condition[0]) >= condition[1];
      if (check) {
        poll.voteEnded = true;
      } else {
        return;
      }
    });
    await polls.save();
  } catch (error) {
    console.log(error);
  }
});

module.exports = checkVoteTimeLimit;
