//NPM Imports
const express = require("express");
const cookierParser = require("cookie-parser");

//Database Import/Startup
require("./db/mongoose");

//Database Model Imports
const userRouter = require("./routers/user-router");
const pollRouter = require("./routers/poll-router");

//Express Setup
const app = express();
const port = process.env.PORT || 3000;

//Middleware Mounts
app.use(express.json());
app.use(cookierParser());

//Router Mounts
app.use(userRouter);
app.use(pollRouter);

app.listen(port, () => console.log("Server is running"));
