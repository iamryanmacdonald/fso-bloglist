const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
}, 10000);

describe("when there is initially some blogs saved", () => {
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
});

describe("addition of a new blog", () => {
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

  test("blog without likes is added with likes set to zero", async () => {
    const newBlog = {
      title: "Learn to code in 2019, get hired, and have fun along the way",
      author: "Andrei Naegoie",
      url: "https://medium.com/zerotomastery/learn-to-code-in-2019-get-hired-and-have-fun-along-the-way-d4197f96be27",
    };

    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.statusCode).toBe(201);
    expect(response.body.likes).toBe(0);
  });

  test("blog without title is not added", async () => {
    const newBlog = {
      author: "Andrei Naegoie",
      url: "https://medium.com/zerotomastery/learn-to-code-in-2019-get-hired-and-have-fun-along-the-way-d4197f96be27",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("blog without url is not added", async () => {
    const newBlog = {
      title: "Learn to code in 2019, get hired, and have fun along the way",
      author: "Andrei Naegoie",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const startBlogs = await helper.blogsInDb();
    const deletedBlogIndex = Math.floor(Math.random() * startBlogs.length);
    const deletedBlog = startBlogs[deletedBlogIndex];

    await api.delete(`/api/blogs/${deletedBlog.id}`).expect(204);

    const endBlogs = await helper.blogsInDb();

    expect(endBlogs).toHaveLength(helper.initialBlogs.length - 1);

    expect(endBlogs.map((blog) => blog.title)).not.toContain(deletedBlog.title);
  });
});

describe("update of an existing blog", () => {
  test("returns the blog as json", async () => {
    const startBlogs = await helper.blogsInDb();
    const updatedBlogIndex = Math.floor(Math.random() * startBlogs.length);
    const updatedBlog = startBlogs[updatedBlogIndex];

    const oldTitle = updatedBlog.title;
    const newTitle = "This is a new, test title";

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send({
        title: newTitle,
        author: updatedBlog.author,
        url: updatedBlog.url,
        likes: updatedBlog.liked,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const endBlogs = await helper.blogsInDb();
    const endBlogTitles = endBlogs.map((blog) => blog.title);

    expect(endBlogTitles).toContain(newTitle);
    expect(endBlogTitles).not.toContain(oldTitle);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
