const taskForm = document.getElementById('task-form');
const addTaskButton = document.getElementById('add-task-button');
const backButton = document.getElementById('back-button');
const saveTaskButton = document.getElementById('save-task-button')

async function loadMatrix() {
  const tasks = await window.electronAPI.getTasks();

  Object.entries(tasks).forEach(([quadrant, taskList]) => {
    const quadrantEl = document.getElementById(quadrant)?.querySelector('ul');
    if (quadrantEl) {
      quadrantEl.innerHTML = '';
      taskList.forEach((task, index) => {
        const taskItem = document.createElement('li');

        // Task name
        const taskText = document.createElement('button');
        taskText.textContent = task.name;
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.marginLeft = '10px';
        editButton.style.color = 'white';
        editButton.style.backgroundColor = '#ff4d4d';
        editButton.style.border = 'none';
        editButton.style.borderRadius = '5px';
        editButton.style.padding = '3px 7px';
        editButton.style.cursor = 'pointer';

        editButton.addEventListener('click', async () => {
          localStorage.setItem('taskName', task.name);
          localStorage.setItem('taskId', index);
          localStorage.setItem('quadrant', quadrant);
          window.location.href = './edit-task.html';
        });

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
        taskItem.appendChild(editButton);
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

if (saveTaskButton) {
  saveTaskButton.addEventListener('click', async () => {
    const quadrant = localStorage.getItem('quadrant')
    const index = localStorage.getItem('taskId');
    await window.electronAPI.deleteTask(quadrant, index);
    const name = document.getElementById('edit-task-name').value;
    const urgent = document.getElementById('edit-urgent').checked;
    const important = document.getElementById('edit-important').checked;
    await window.electronAPI.addTask({ name, urgent, important });
    loadMatrix();
    window.location.href = './view.html';
  });
}

// Load matrix tasks on matrix page
if (document.getElementById('matrix')) {
  loadMatrix();
}
