/**
 * @jest-environment jsdom
 */
require('@testing-library/jest-dom');
const {
  fireEvent,
  getByText,
  getByLabelText,
} = require('@testing-library/dom');

describe('To-Do List - Button Interactions', () => {
  let viewTasksButton;
  const originalLocation = window.location; // Save the origin window.location

  beforeAll(() => {
    // Use Object.defineProperty to redefine window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        assign: jest.fn((url) => {
          window.location.href = url;
        }),
      },
      writable: true, // allows others to modify the attribute
    });
  });

  afterAll(() => {
    // Restore window.location
    window.location = originalLocation;
  });

  beforeEach(() => {
    // Set up a mock HTML structure as per your index.html file
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

    // Initialize the elements
    viewTasksButton = document.getElementById('view-tasks');

    // Mock the window.electronAPI
    window.electronAPI = {
      addTask: jest.fn(),
    };

    // Import your renderer.js to attach event listeners
    require('../renderer/renderer.js');
  });

  it('should navigate to view tasks when clicking "View Tasks" button', () => {
    // Simulate a click on the "View Tasks" button
    fireEvent.click(viewTasksButton);

    // Check if window.location.href was set to the correct URL
    expect(window.location.href).toBe('./view.html');
  });
});
