import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(e);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
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
      <div>
        {user.name} logged in <button onClick={logout}>logout</button>
      </div>
      <br />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  ) : (
    loginForm()
  );
};

export default App;
