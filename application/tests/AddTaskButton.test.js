/**
 * @jest-environment jsdom
 */
require("@testing-library/jest-dom");
const {
  fireEvent,
  getByText,
  getByLabelText,
} = require("@testing-library/dom");

describe("To-Do List - Button Interactions", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>To-Do List - Add Task</title>
      </head>
      <body>
        <h1>Add Task</h1>
        <form id="task-form">
          <input type="text" id="task-name" placeholder="Task Name" required />
          <label>
            <input type="checkbox" id="urgent" /> Urgent
          </label>
          <label>
            <input type="checkbox" id="important" /> Important
          </label>
          <button type="submit">Add Task</button>
        </form>
        <button id="view-tasks">View Tasks</button>
        <script src="./renderer.js"></script>
      </body>
      </html>
    `;
    window.electronAPI = {
      addTask: jest.fn(),
    };
  });

  test("should submit the task form", () => {
    const taskForm = document.getElementById("task-form");
    const taskNameInput = document.getElementById("task-name");
    const urgentCheckbox = document.getElementById("urgent");
    const importantCheckbox = document.getElementById("important");

    // Mock the window.electronAPI.addTask method
    window.electronAPI = {
      addTask: jest.fn(),
    };

    taskNameInput.value = "Test Task";
    urgentCheckbox.checked = true;
    importantCheckbox.checked = false;

    fireEvent.submit(taskForm);

    expect(window.electronAPI.addTask).toHaveBeenCalledWith({
      name: "Test Task",
      urgent: true,
      important: false,
    });

    expect(taskNameInput.value).toBe("");
    expect(urgentCheckbox.checked).toBe(false);
    expect(importantCheckbox.checked).toBe(false);
  });

  test('should navigate to view tasks when clicking "View Tasks" button', () => {
    const viewTasksButton = document.getElementById("view-tasks");

    // Mock window.location.href
    delete window.location;
    window.location = { href: "" };

    fireEvent.click(viewTasksButton);

    expect(window.location.href).toBe("./view.html");
  });
});
