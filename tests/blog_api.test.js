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

test("returned blogs have id parameter", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Learn to code in 2019, get hired, and have fun along the way",
    author: "Andrei Naegoie",
    url: "https://medium.com/zerotomastery/learn-to-code-in-2019-get-hired-and-have-fun-along-the-way-d4197f96be27",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  expect(blogs.map((blog) => blog.title)).toContain(
    "Learn to code in 2019, get hired, and have fun along the way"
  );
});

test("a valid blog with no likes parameter automatically sets it to zero", async () => {
  const newBlog = {
    title: "Learn to code in 2019, get hired, and have fun along the way",
    author: "Andrei Naegoie",
    url: "https://medium.com/zerotomastery/learn-to-code-in-2019-get-hired-and-have-fun-along-the-way-d4197f96be27",
  };

  const response = await api.post("/api/blogs").send(newBlog);

  expect(response.statusCode).toBe(201);
  expect(response.body.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
