import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  let container;
  const createBlog = jest.fn();

  const blog = {
    author: "Edsger W. Dijkstra",
    title: "Canonical string reduction",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  beforeEach(() => {
    container = render(<BlogForm createBlog={createBlog} />).container;
  });

  test("after clicking submit the event handler receives the correct argument", async () => {
    const user = userEvent.setup();

    const titleInput = container.querySelector("#title");
    const authorInput = container.querySelector("#author");
    const urlInput = container.querySelector("#url");

    const button = container.querySelector("#create");

    await user.type(titleInput, blog.title);
    await user.type(authorInput, blog.author);
    await user.type(urlInput, blog.url);

    await user.click(button);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual(blog);
  });
});
