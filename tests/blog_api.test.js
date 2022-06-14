const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");
const logger = require("../utils/logger");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
}, 10000);

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
