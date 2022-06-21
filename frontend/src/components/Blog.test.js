import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const removeBlog = jest.fn();

  const blog = {
    id: "123456789abcdefghijklmnopqrstuvwxyz",
    author: "Edsger W. Dijkstra",
    likes: 12,
    title: "Canonical string reduction",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    user: {
      id: "zyxwvutsrqponmlkjihgfedcba987654321",
    },
  };

  beforeEach(() => {
    container = render(
      <Blog key={blog.id} blog={blog} removeBlog={removeBlog} />
    ).container;
  });

  test("renders blog title and author but not url or number of likes", () => {
    expect(container.querySelector(".blogHeader")).not.toHaveStyle(
      "display: none"
    );
    expect(container.querySelector(".blogInfo")).toHaveStyle("display: none");
  });
});
