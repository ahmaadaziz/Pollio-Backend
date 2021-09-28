const express = require("express");
//require("./db/mongoose");
const userRouter = require("./routers/user-router");
const pollRouter = require("./routers/poll-router");
const CronJob = require("cron").CronJob;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(pollRouter);

//CRON Testing
const job = new CronJob("* * * * *", () => {
  console.log(`Server is up on port ${port}`);
  console.log(job.nextDates());
});

app.listen(port, () => job.start());
