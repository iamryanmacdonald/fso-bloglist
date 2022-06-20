import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [author, setAuthor] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const blog = await blogService.create({ title, author, url });

      setBlogs(blogs.concat(blog));
      setTitle("");
      setAuthor("");
      setUrl("");

      setNotification({
        message: `a new blog ${blog.title} by ${blog.author} added`,
        type: "notification",
      });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    } catch (err) {
      setNotification({ message: err.response.data.error, type: "error" });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");

      setNotification({
        message: `Logged in as ${user.name}`,
        type: "notification",
      });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    } catch (err) {
      setNotification({ message: err.response.data.error, type: "error" });

      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
    blogService.setToken(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      {notificationBar()}
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const notificationBar = () => {
    if (notification.message === "") return null;

    let color;

    switch (notification.type) {
      case "error":
        color = "red";
        break;
      case "notification":
        color = "green";
        break;
      default:
        color = "black";
    }

    return (
      <div
        style={{
          background: "lightgray",
          borderRadius: "5px",
          borderStyle: "solid",
          color,
          fontSize: "20px",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        {notification.message}
      </div>
    );
  };

  useEffect(() => {
    const user_token = window.localStorage.getItem("user");

    if (user_token) {
      const user = JSON.parse(user_token);
      setUser(user);
    }

    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  return user ? (
    <div>
      <h2>blogs</h2>
      {notificationBar()}
      <div>
        {user.name} logged in <button onClick={logout}>logout</button>
      </div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  ) : (
    loginForm()
  );
};

export default App;
