import { fireEvent } from '@testing-library/dom';

describe('Quadrant Click Navigation', () => {
  let quadrants;

  beforeEach(() => {
    // Set up a mock DOM structure
    document.body.innerHTML = `
    <body>
        <h1>Eisenhower Matrix</h1>
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
        <button id="delete-selected-button">Delete Selected</button>
        <button id="add-task-button">Add Task</button>
        <button id="help" style="">Help</button>
        <script src="./renderer.js"></script>
    </body>
    `;

    quadrants = document.querySelectorAll('.quadrant');

    // Mock the window.location.href
    delete window.location;
    window.location = { href: jest.fn() };

    // Your application logic
    for (const quadrant of quadrants) {
      quadrant.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'input') {
          return;
        }

        const sectionId = quadrant.getAttribute('id');
        const targetPage = `section.html?id=${encodeURIComponent(sectionId)}`;
        window.location.href = targetPage;
      });
    }
  });

  it('navigates to the correct page when a quadrant is clicked', () => {
    const quadrant1 = document.getElementById('quadrant1');

    // Simulate a click event
    fireEvent.click(quadrant1);
    print(quadrant1);
    // Assert that window.location.href was updated correctly
    expect(window.location.href).toBe('section.html?id=quadrant1');
  });

  it('does not navigate when the click is on matrix', () => {
    const inputElement = document.getElementById('matrix');

    // Simulate a click event
    fireEvent.click(inputElement);

    // Assert that window.location.href was not changed
    expect(window.location.href).not.toContain('section.html');
  });

  it('does not navigate when a non-quadrant element is clicked', () => {
    const helpButton = document.getElementById('help'); // Select an existing non-quadrant element
  
    // Simulate a click event
    fireEvent.click(helpButton);
  
    // Assert that window.location.href was not changed
    expect(window.location.href).not.toContain('section.html');
  });
});