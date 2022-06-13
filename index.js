const cors = require("cors");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const logger = require("./utils/logger");

mongoose.connect(config.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
