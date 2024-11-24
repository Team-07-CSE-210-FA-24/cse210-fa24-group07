const taskForm = document.getElementById('task-form');
const addTaskButton = document.getElementById('add-task-button');
const backButton = document.getElementById('back-button');

async function loadMatrix() {
  const tasks = await window.electronAPI.getTasks();

  Object.entries(tasks).forEach(([quadrant, taskList]) => {
    const quadrantEl = document.getElementById(quadrant)?.querySelector('ul');
    if (quadrantEl) {
      quadrantEl.innerHTML = '';
      taskList.forEach((task, index) => {
        const taskItem = document.createElement('li');

        // Task name
        const taskText = document.createElement('span');
        taskText.textContent = task.name;

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.color = 'white';
        deleteButton.style.backgroundColor = '#ff4d4d';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '5px';
        deleteButton.style.padding = '3px 7px';
        deleteButton.style.cursor = 'pointer';

        deleteButton.addEventListener('click', async () => {
          await window.electronAPI.deleteTask(quadrant, index);
          loadMatrix(); // Reload matrix after deletion
        });

        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
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
