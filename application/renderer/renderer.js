const taskForm = document.getElementById('task-form');
const addTaskButton = document.getElementById('add-task-button');
const backButton = document.getElementById('back-button');

async function loadMatrix() {
  const tasks = await window.electronAPI.getTasks();

  Object.entries(tasks).forEach(([quadrant, taskList]) => {
    const quadrantEl = document.getElementById(quadrant)?.querySelector('ul');
    if (quadrantEl) {
      quadrantEl.innerHTML = '';
      taskList.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;
        quadrantEl.appendChild(taskItem);
      });
    }
  });
}

// Navigate to add task page
if (addTaskButton) {
  addTaskButton.addEventListener('click', () => {
    window.location.href = './add-task.html';
  });
}

// Add task and return to matrix view
if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('task-name').value;
    const urgent = document.getElementById('urgent').checked;
    const important = document.getElementById('important').checked;

    await window.electronAPI.addTask({ name, urgent, important });
    window.location.href = './view.html';
  });
}

// Navigate back to matrix view
if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });
}

// Load matrix tasks on matrix page
if (document.getElementById('matrix')) {
  loadMatrix();
}
