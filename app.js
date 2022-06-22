const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

require("express-async-errors");

const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

mongoose.connect(config.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
