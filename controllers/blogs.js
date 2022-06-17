const router = require("express").Router();

const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

router.delete("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (user.id === blog.user.toString()) {
    await blog.delete();

    response.status(204).end();
  } else {
    response
      .status(401)
      .json({ error: "cannot delete blog that you did not post" });
  }
});

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });

  response.json(blogs);
});

router.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;

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

router.put("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (user.id === blog.user.toString()) {
    await blog.update(request.body);

    response.json(blog);
  } else {
    response
      .status(401)
      .json({ error: "cannot update blog that you did not post" });
  }
});

module.exports = router;
