import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  test("clicking the view button shows the content", async () => {
    const user = userEvent.setup()
    const button = container.querySelector(".toggleVisibility");
    await user.click(button)

    expect(container.querySelector('.blogInfo')).not.toHaveStyle('display: none')
  });
});
