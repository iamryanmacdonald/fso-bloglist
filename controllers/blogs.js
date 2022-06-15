const router = require("express").Router();

const Blog = require("../models/blog");

router.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

router.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

router.post("/", async (request, response) => {
  const blog = new Blog({ ...request.body, likes: request.body.likes || 0 });

  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

module.exports = router;
