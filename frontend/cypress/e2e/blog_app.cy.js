describe("Blog app", function () {
  const user = {
    username: "rmacdonald",
    name: "Ryan Macdonald",
    password: "password",
  };

  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const blog2 = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 5,
  };

  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type(user.username);
      cy.get("#password").type(user.password);
      cy.contains("login").click();

      cy.get("#notification").should("contain", `Logged in as ${user.name}`);
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type(user.username);
      cy.get("#password").type("wrongpassword");
      cy.contains("login").click();

      cy.get("#notification").should("contain", "invalid username or password");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type(user.username);
      cy.get("#password").type(user.password);
      cy.contains("login").click();
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type(blog.title);
      cy.get("#author").type(blog.author);
      cy.get("#url").type(blog.url);
      cy.get("#create").click();

      cy.get("#notification").should(
        "contain",
        `a new blog ${blog.title} by ${blog.author} added`
      );
      cy.get(".blogHeader").should("contain", blog.title);
    });

    it("user can delete their own blog", function () {
      cy.contains("new blog").click();
      cy.get("#title").type(blog.title);
      cy.get("#author").type(blog.author);
      cy.get("#url").type(blog.url);
      cy.get("#create").click();

      cy.get(".toggleVisibility").click();
      cy.get("#remove").click();

      cy.get(".blogHeader").should("not.exist");
    });
  });
});
