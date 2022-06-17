const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const config = require("../utils/config");

router.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });

  response.json(blogs);
});

router.post("/", async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

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
