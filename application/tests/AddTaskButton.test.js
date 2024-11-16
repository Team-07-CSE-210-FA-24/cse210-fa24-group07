/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");
const { fireEvent } = require("@testing-library/dom");

beforeEach(() => {
  document.body.innerHTML = `
    <button id="submit">Add Task</button>
  `;
});

test("button click should change its text", () => {
  const button = document.getElementById("submit");

  expect(button).not.toBeNull();

  button.addEventListener("click", () => {
    button.textContent = "Task Added!";
  });

  expect(button.textContent).toBe("Add Task");

  fireEvent.click(button);

  expect(button.textContent).toBe("Task Added!");
});
