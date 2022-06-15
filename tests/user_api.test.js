const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially one user in the database", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "admin", name: "Ryan", passwordHash });

    await user.save();
  }, 10000);

  test("creation succeeds with a fresh username", async () => {
    const startUsers = await helper.usersInDb();

    const newUser = {
      username: "newUser",
      name: "robot",
      password: "definitelysecret",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const endUsers = await helper.usersInDb();
    expect(endUsers).toHaveLength(startUsers.length + 1);

    const usernames = endUsers.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("returns an array of users in the database without sensitive information", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const testUser = response.body[0];

    expect(testUser.passwordHash).not.toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
