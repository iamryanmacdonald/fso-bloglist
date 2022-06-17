const router = require("express").Router();

const Blog = require("../models/blog");
const User = require("../models/user");

router.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });

  response.json(blogs);
});

router.post("/", async (request, response) => {
  const users = await User.find({});
  const user = users[0];

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

router.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = await Blog.findByIdAndUpdate(request.params.id, body);

  response.json(blog);
});

module.exports = router;
