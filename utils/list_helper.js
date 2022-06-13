const dummy = (blogs) => {
  return 1;
};

const favoriteBlog = (blogs) => {
  const blog = blogs
    .map((blog) => {
      return { ...blog };
    })
    .reduce((previous, current) =>
      previous.likes > current.likes ? previous : current
    );

  delete blog._id;
  delete blog.__v;
  delete blog.url;

  return blog;
};

const totalLikes = (blogs) =>
  blogs.reduce((previous, current) => (previous += current.likes), 0);

module.exports = { dummy, favoriteBlog, totalLikes };
