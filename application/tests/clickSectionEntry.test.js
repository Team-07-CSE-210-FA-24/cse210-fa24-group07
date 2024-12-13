// Import necessary libraries
const { screen, fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

// Mock for navigation which simulates window.location.href changes
const originalLocation = window.location;
delete window.location;
window.location = { href: '' };

// Sample test for clicking the section entries
describe('Click section entries', () => {
  beforeAll(() => {
    // Load the renderer script where the help button functionality is defined
    document.body.innerHTML = `
    <div id="matrix">
      <div class="quadrant" id="quadrant1">
        <h3>✅ Do</h3>
        <ul></ul>
      </div>
      <div class="quadrant" id="quadrant2">
        <h3>📅 Schedule</h3>
        <ul></ul>
      </div>
      <div class="quadrant" id="quadrant3">
        <h3>📤 Delegate</h3>
        <ul></ul>
      </div>
      <div class="quadrant" id="quadrant4">
        <h3>❌ Tasks to Delete</h3>
        <ul></ul>
      </div>
    </div>
    `;
    require('../renderer/renderer.js'); // Update with actual path to your renderer.js
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  for (let i = 0; i < 4; i++) {
    test(`Clicking on quadurant ${i + 1}`, () => {
      let quadrants = ['✅ Do', '📅 Schedule', '📤 Delegate', '❌ Tasks to Delete']
      let sections = ['section.html?id=quadrant1', 'section.html?id=quadrant2', 'section.html?id=quadrant3', 'section.html?id=quadrant4']

      fireEvent.click(screen.getByText(quadrants[i]));
      expect(window.location.href).toBe(sections[i]);
    });
  }
});

