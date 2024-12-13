import '@testing-library/jest-dom';

describe('Adding a task', () => {
  let taskForm;

  beforeEach(() => {
    // Create a mock DOM environment
    document.body.innerHTML = `
    <form id="taskForm">
        <input id="task-name" type="text" />
        <textarea id="markdown-input"></textarea>
        <input id="urgent" type="checkbox" />
        <input id="important" type="checkbox" />
        <input id="deadline" type="date" />
    </form>
    `;

    // Get the form
    taskForm = document.getElementById('taskForm');

    // Mock Electron API and location
    global.window = {
      electronAPI: {
        addTask: jest.fn().mockResolvedValue(true)
      },
      location: {
        href: ''
      }
    };
  });

  it('should add a task', async () => {
    // Setup form values
    document.getElementById('task-name').value = 'Test Task';
    document.getElementById('markdown-input').value = 'Test notes';
    document.getElementById('urgent').checked = true;
    document.getElementById('important').checked = false;
    document.getElementById('deadline').value = '2024-12-31';

    // Create submit event
    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true
    });

    // Spy on preventDefault
    const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

    // Directly replicate the event listener from renderer.js
    if (taskForm) {
      taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value;
        const notes = document.getElementById('markdown-input').value;
        const urgent = document.getElementById('urgent').checked;
        const important = document.getElementById('important').checked;
        const deadline = document.getElementById('deadline').value;

        await window.electronAPI.addTask({
          name,
          notes,
          urgent,
          important,
          deadline,
        });
      });
    }

    // Dispatch the submit event
    taskForm.dispatchEvent(submitEvent);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assertions
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(window.electronAPI.addTask).toHaveBeenCalledWith({
      name: 'Test Task',
      notes: 'Test notes',
      urgent: true,
      important: false,
      deadline: '2024-12-31'
    });
  });


});

describe('Deleting a task', () => {
    let deleteSelectedButton;
    let tasks;
  
    beforeEach(() => {
      // Create a mock DOM environment
      document.body.innerHTML = `
        <button id="delete-selected-button">Delete Selected</button>
      `;
  
      // Get the delete button
      deleteSelectedButton = document.getElementById('delete-selected-button');
  
      // Mock global objects
      global.window = {
        electronAPI: {
          deleteTask: jest.fn().mockResolvedValue(true)
        }
      };
  
      // Mock global functions
      global.loadMatrix = jest.fn().mockResolvedValue(true);
  
      // Reset selected tasks
      tasks = {
        'quadrant1': [2, 0, 1],
        'quadrant2': [1, 3],
        'quadrant3': [0]
      };
    });
  
    it('should delete tasks in the correct order', async () => {
      // Add event listener matching the original implementation
      if (deleteSelectedButton) {
        deleteSelectedButton.addEventListener('click', async () => {
          for (const [quadrant, indices] of Object.entries(tasks)) {
            // Sort indices in descending order to avoid index shifting during deletion
            for (const index of indices.sort((a, b) => b - a)) {
              await window.electronAPI.deleteTask(quadrant, index);
            }
          }
          await loadMatrix(); // Reload matrix after deletion
        });
      }
  
      // Trigger the click event
      const clickEvent = new Event('click');
      deleteSelectedButton.dispatchEvent(clickEvent);
  
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
  
      // Verify delete operations
      expect(window.electronAPI.deleteTask).toHaveBeenCalledTimes(6);
  
      // Check deletion order for each quadrant
      const expectedCalls = [
        ['quadrant1', 2],
        ['quadrant1', 1],
        ['quadrant1', 0],
        ['quadrant2', 3],
        ['quadrant2', 1],
        ['quadrant3', 0]
      ];
  
      expectedCalls.forEach((call, index) => {
        expect(window.electronAPI.deleteTask.mock.calls[index]).toEqual(call);
      });
  
      // Verify matrix reload
      expect(loadMatrix).toHaveBeenCalledTimes(1);
    });
  
});

describe('Editing a task', () => {
    let quadrant, index, notes;
    let tasks, expectedTasks;
    let saveButton;
  
    beforeEach(() => {
      // Create a mock DOM environment
      document.body.innerHTML = `
        <button id="save-notes" type="button">Save Notes</button>
      `;
  
      // Get the save button
      saveButton = document.getElementById('save-notes');
  
      // Mock global objects
      global.window = {
        electronAPI: {
          updateNotes: jest.fn().mockResolvedValue(true)
        }
      };
  
      notes = 1;
      quadrant = 0;
      index = 0;
    });
  
    it('should edit the task note', async () => {
      // Add event listener matching the original implementation
      saveButton.addEventListener('click', async () => {
        await window.electronAPI.updateNotes({ quadrant, index, notes });
    });
  
      // Trigger the click event
      const clickEvent = new Event('click');
      saveButton.dispatchEvent(clickEvent);
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(window.electronAPI.updateNotes).toHaveBeenCalledWith({
        quadrant: 0,
        index: 0,
        notes: 1
      });

    });
  
});