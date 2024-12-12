/**
 * JavaScript functionality for the "Section" page in the DevZen application.
 *
 * This script dynamically loads tasks from a specific section (quadrant) of the task matrix,
 * displays them on the page, and provides functionality to delete individual tasks.
 *
 * Key functionalities:
 * - `getQueryParam(param)`: Retrieves a query parameter value from the page URL.
 *   - Used to fetch the section (quadrant) ID passed as a parameter to the page.
 *
 * - Dynamic task loading:
 *   - Fetches all tasks using the Electron API (`getTasks`) and filters tasks based on the section ID.
 *   - Displays tasks in the `task-list` unordered list.
 *   - Sets appropriate headings based on the section:
 *     - Quadrant 1: "✅ Do"
 *     - Quadrant 2: "📅 Schedule"
 *     - Quadrant 3: "📤 Delegate"
 *     - Quadrant 4: "❌ Delete"
 *
 * - Task deletion:
 *   - Each task is displayed with a "Delete" button.
 *   - Clicking the button deletes the task using the Electron API (`deleteTask`) and reloads the page to reflect changes.
 *
 * - Navigation:
 *   - "Back" button redirects users to the main task matrix page (`view.html`).
 *
 * Associated HTML elements:
 * - `backButton` (id="back-button"): Button for navigating back to the main task matrix.
 * - `pageHeading` (`h1`): Displays the heading for the current section (quadrant).
 * - `sectionTaskList` (id="task-list"): Unordered list dynamically populated with tasks from the current section.
 *
 * Integration:
 * - Uses Electron API to fetch (`getTasks`) and delete (`deleteTask`) tasks.
 * - Dynamically updates the DOM to reflect the tasks within the selected quadrant.
 *
 * This script enhances user interaction within specific sections of the task matrix, allowing
 * seamless task viewing and management for a focused experience.
 */

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const sectionId = getQueryParam('id');
const backButton = document.getElementById('back-button');
const pageHeading = document.querySelector('h1');
const tasks = await window.electronAPI.getTasks();
const sectionTasks = tasks[sectionId] || [];
const sectionTaskList = document.getElementById('task-list');

if (sectionId === 'quadrant1') {
  pageHeading.textContent = '✅ Do';
} else if (sectionId === 'quadrant2') {
  pageHeading.textContent = '📅 Schedule';
} else if (sectionId === 'quadrant3') {
  pageHeading.textContent = '📤 Delegate';
} else {
  pageHeading.textContent = '❌ Delete';
}

if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });
}

sectionTasks.forEach((task, index) => {
  const taskItem = document.createElement('li');
  taskItem.style.display = 'flex';
  taskItem.style.justifyContent = 'space-between';
  taskItem.style.alignItems = 'center';

  const taskText = document.createElement('span');
  taskText.textContent = task.name;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.style.backgroundColor = '#ff4d4d';
  deleteButton.addEventListener('click', async () => {
    await window.electronAPI.deleteTask(sectionId, index);
    location.reload();
  });

  taskItem.appendChild(taskText);
  taskItem.appendChild(deleteButton);
  sectionTaskList.appendChild(taskItem);
});
