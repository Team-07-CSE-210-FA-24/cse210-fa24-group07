// Import necessary libraries
const { screen } = require('@testing-library/dom');
require('@testing-library/jest-dom');

const { loadMatrix } = require('../renderer/renderer.js'); // Update with the actual path to loadMatrix

describe('loadMatrix Functionality', () => {
  beforeAll(() => {
    // Set up our document body
    document.body.innerHTML = `
      <div id="quadrant1"><ul></ul></div>
      <div id="quadrant2"><ul></ul></div>
      <div id="quadrant3"><ul></ul></div>
      <div id="quadrant4"><ul></ul></div>
    `;

    // Mock the Electron API
    window.electronAPI = {
      getTasks: jest.fn().mockResolvedValue({
        quadrant1: [
          {
            name: 'Task 1',
            deadline: new Date().toISOString(),
            important: true,
            urgent: true,
          },
        ],
        quadrant2: [],
        quadrant3: [],
        quadrant4: [],
      }),
    };

    // Require the actual JavaScript file where loadMatrix is defined
    require('../renderer/renderer.js'); // Update with actual path to your renderer.js
  });

  test('loadMatrix loads tasks into correct quadrants', async () => {
    await loadMatrix();
    // Wait for the asynchronous DOM updates
    const taskElement = await screen.findByText(/Task 1/);
    // Now check the specific content within the DOM
    const taskTextContent = taskElement.textContent;
    expect(taskTextContent).toContain('Task 1');
  });
});
