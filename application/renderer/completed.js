/**
 * JavaScript functionality for the "Completed Tasks" page in the DevZen application.
 *
 * This script dynamically loads and displays the user's completed tasks and provides
 * interactivity for viewing or deleting tasks. It also includes navigation to return
 * to the dashboard.
 *
 * Key functionalities:
 * - `loadCompletedTasks()`: Fetches the list of completed tasks using the Electron API and
 *   dynamically populates the task list (`completed-list`) with task details and action buttons.
 *   - Displays each task's name and deadline (if available).
 *   - Shows the task's category, if applicable.
 *   - Provides a "View Task" button to navigate to the task's details page.
 *   - Provides a "Delete" button to remove the task from the completed list.
 *   - Reloads the task list after deletion to reflect changes.
 *
 * - Event listener for the "Back to Dashboard" button:
 *   - Redirects the user to the main dashboard page (`view.html`) when clicked.
 *
 * Associated HTML elements:
 * - `completed-list` (id): Container for dynamically generated task list items.
 * - `back-to-view` (id): Button for navigation back to the dashboard.
 *
 * Integrates with the Electron IPC API for:
 * - Fetching completed tasks (`getCompletedTasks`).
 * - Deleting a specific completed task (`deleteCompletedTask`).
 *
 * This script ensures smooth interactivity and seamless management of completed tasks,
 * enhancing user experience on the "Completed Tasks" page.
 */

document.getElementById('back-to-view').addEventListener('click', () => {
  window.location.href = './view.html';
});

async function loadCompletedTasks() {
  const completedTasks = await window.electronAPI.getCompletedTasks();
  const completedList = document.getElementById('completed-list');
  completedList.innerHTML = '';

  completedTasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.style.flexDirection = 'column';
    li.style.alignItems = 'flex-start';

    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
    const deadline = task.deadline
      ? ` (${(new Date(task.deadline).getMonth() + 1).toString().padStart(2, '0')}/${new Date(task.deadline).getDate().toString().padStart(2, '0')})`
      : '';
    taskHeader.textContent = `${task.name}${deadline}`;
    li.appendChild(taskHeader);

    if (task.category) {
      const categoryElem = document.createElement('div');
      categoryElem.classList.add('task-category');
      categoryElem.textContent = `Category: ${task.category}`;
      li.appendChild(categoryElem);
    }

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const viewTaskButton = document.createElement('button');
    viewTaskButton.textContent = 'View Task';
    viewTaskButton.addEventListener('click', () => {
      window.location.href = `./notes.html?quadrant=completed&index=${i}&mode=view&completed=true`;
    });
    buttonRow.appendChild(viewTaskButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await window.electronAPI.deleteCompletedTask(i);
      loadCompletedTasks();
    });
    buttonRow.appendChild(deleteButton);

    li.appendChild(buttonRow);
    completedList.appendChild(li);
  });
}

loadCompletedTasks();
