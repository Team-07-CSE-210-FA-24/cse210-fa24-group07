/**
 * JavaScript functionality for the main task management interface of the DevZen application.
 *
 * This script manages the display and interactivity of the task matrix, including task addition, deletion,
 * marking tasks as completed, viewing completed tasks, and navigating to other parts of the application.
 *
 * Key functionalities:
 * - Task management:
 *   - Dynamically loads tasks into their respective quadrants using `loadMatrix()`.
 *   - Sorts tasks by deadline for better prioritization.
 *   - Allows selection of tasks for deletion or marking as completed.
 *   - Updates the visibility of action buttons based on selected tasks.
 * - Event handling:
 *   - `deleteSelectedButton`: Deletes selected tasks from the matrix.
 *   - `markCompletedButton`: Marks selected tasks as completed and moves them to the completed list.
 *   - `addTaskButton`: Navigates to the task addition page.
 *   - `viewCompletedButton`: Navigates to the completed tasks page.
 *   - `infoButton`: Navigates to the help page.
 *   - `backFromHelpButton`: Returns to the main view page from the help page.
 *   - `quadrants`: Navigates to detailed sections for individual quadrants when clicked.
 * - Task form submission:
 *   - Captures user input (task name, notes, urgency, importance, and deadline).
 *   - Adds a new task via the Electron API and reloads the matrix.
 * - Integration:
 *   - Uses Electron API methods (`getTasks`, `deleteTask`, `completeTask`, `addTask`) for data persistence and interactivity.
 *   - Dynamically updates the DOM to reflect task changes without requiring a page refresh.
 *
 * Associated HTML elements:
 * - Buttons:
 *   - `addTaskButton` (id="add-task-button"): Adds new tasks.
 *   - `deleteSelectedButton` (id="delete-selected-button"): Deletes selected tasks.
 *   - `markCompletedButton` (id="mark-completed-button"): Marks selected tasks as completed.
 *   - `viewCompletedButton` (id="view-completed-button"): Navigates to the completed tasks page.
 *   - `infoButton` (id="info-button"): Opens the help page.
 *   - `backFromHelpButton` (id="back"): Navigates back from the help page.
 * - Task form:
 *   - Captures user input for creating a new task (task name, notes, urgency, importance, deadline).
 * - Task matrix:
 *   - `quadrants` (class="quadrant"): Represents the four quadrants of the task matrix.
 *
 * This script enhances user interaction with the task management interface, ensuring seamless navigation,
 * task handling, and real-time updates for better productivity and organization.
 */

const taskForm = document.getElementById('task-form');
const addTaskButton = document.getElementById('add-task-button');
const deleteSelectedButton = document.getElementById('delete-selected-button');
const markCompletedButton = document.getElementById('mark-completed-button');
const viewCompletedButton = document.getElementById('view-completed-button');
const backFromHelpButton = document.getElementById('back');
const quadrants = document.querySelectorAll('.quadrant');
const infoButton = document.getElementById('info-button');

let selectedTasks = {};

function updateButtonVisibility() {
  const hasSelectedTasks = Object.keys(selectedTasks).length > 0;
  deleteSelectedButton.style.display = hasSelectedTasks
    ? 'inline-block'
    : 'none';
  markCompletedButton.style.display = hasSelectedTasks
    ? 'inline-block'
    : 'none';
}

async function loadMatrix() {
  const tasks = await window.electronAPI.getTasks();
  selectedTasks = {};
  updateButtonVisibility();

  for (const [quadrant, taskList] of Object.entries(tasks)) {
    if (quadrant === 'completed') continue;
    const quadrantEl = document.getElementById(quadrant)?.querySelector('ul');
    if (quadrantEl) {
      quadrantEl.innerHTML = '';

      const sortedTasks = taskList.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });

      sortedTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!selectedTasks[quadrant]) selectedTasks[quadrant] = [];
            selectedTasks[quadrant].push(index);
          } else {
            selectedTasks[quadrant] = selectedTasks[quadrant].filter(
              (i) => i !== index,
            );
            if (selectedTasks[quadrant].length === 0)
              delete selectedTasks[quadrant];
          }
          updateButtonVisibility();
        });

        const taskText = document.createElement('span');
        const deadline = task.deadline
          ? ` (${(new Date(task.deadline).getMonth() + 1).toString().padStart(2, '0')}/${new Date(task.deadline).getDate().toString().padStart(2, '0')})`
          : '';
        taskText.textContent = `${task.name}${deadline}`;

        const viewTaskButton = document.createElement('button');
        viewTaskButton.textContent = 'View Task';
        viewTaskButton.classList.add('btn-sm'); // Smaller button
        viewTaskButton.style.marginLeft = '10px';
        viewTaskButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          window.location.href = `./notes.html?quadrant=${quadrant}&index=${index}&mode=view`;
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(viewTaskButton);
        quadrantEl.appendChild(taskItem);
      });
    }
  }
}

if (deleteSelectedButton) {
  deleteSelectedButton.addEventListener('click', async () => {
    for (const [quadrant, indices] of Object.entries(selectedTasks)) {
      for (const index of indices.sort((a, b) => b - a)) {
        await window.electronAPI.deleteTask(quadrant, index);
      }
    }
    await loadMatrix();
  });
}

if (markCompletedButton) {
  markCompletedButton.addEventListener('click', async () => {
    await window.electronAPI.completeTask(selectedTasks);
    await loadMatrix();
  });
}

if (addTaskButton) {
  addTaskButton.addEventListener('click', () => {
    window.location.href = './add-task.html';
  });
}

if (infoButton) {
  infoButton.addEventListener('click', () => {
    window.location.href = './help.html';
  });
}

if (backFromHelpButton) {
  backFromHelpButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });
}

if (viewCompletedButton) {
  viewCompletedButton.addEventListener('click', () => {
    window.location.href = './completed.html';
  });
}

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
    window.location.href = './view.html';
  });
}

if (document.getElementById('matrix')) {
  loadMatrix();
}

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
