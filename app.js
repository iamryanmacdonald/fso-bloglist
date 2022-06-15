const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

require("express-async-errors");

const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

mongoose.connect(config.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
