import { useState } from "react";

const Blog = ({ blog, removeBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="blogHeader">
        {blog.title} {blog.author}{" "}
        <button className="toggleVisibility" onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      <div className="blogInfo" style={{ display: visible ? "" : "none" }}>
        <div id="blogUrl">{blog.url}</div>
        <div id="blogLikes">
          likes {blog.likes} <button>like</button>
        </div>
        <div id="blogAuthor">{blog.author}</div>
        <button onClick={() => removeBlog(blog)} id="remove">
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
