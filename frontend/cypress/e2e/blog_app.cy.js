describe("Blog app", function () {
  const user = {
    username: "rmacdonald",
    name: "Ryan Macdonald",
    password: "password",
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
});
