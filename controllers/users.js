const bcrypt = require("bcrypt");
const router = require("express").Router();

const User = require("../models/user");

router.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
  });

  response.json(users);
});

router.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password === undefined) {
    return response.status(400).json({ error: "password is required" });
  } else if (password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters in length" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = router;
