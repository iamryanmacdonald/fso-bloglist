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

const mostBlogs = (blogs) => {
  const authored_blogs = blogs.reduce(
    (previous, current) =>
      current.author in previous
        ? { ...previous, [current.author]: previous[current.author] + 1 }
        : { ...previous, [current.author]: 1 },
    {}
  );

  const author = Object.keys(authored_blogs).reduce((previous, current) =>
    authored_blogs[previous] > authored_blogs[current] ? previous : current
  );

  return { author, blogs: authored_blogs[author] };
};

const totalLikes = (blogs) =>
  blogs.reduce((previous, current) => (previous += current.likes), 0);

module.exports = { dummy, favoriteBlog, mostBlogs, totalLikes };
