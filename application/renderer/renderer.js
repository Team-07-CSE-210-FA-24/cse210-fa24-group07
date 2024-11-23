const taskForm = document.getElementById('task-form');
const viewTasksButton = document.getElementById('view-tasks');
const backButton = document.getElementById('back');
const tasksList = document.getElementById('tasks-list');

if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('task-name').value;
    const urgent = document.getElementById('urgent').checked;
    const important = document.getElementById('important').checked;

    await window.electronAPI.addTask({ name, urgent, important });
    taskForm.reset();
  });

  viewTasksButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });
}

if (tasksList) {
  async function loadTasks() {
    const tasks = await window.electronAPI.getTasks();
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.textContent = `${task.name} - ${
        task.urgent ? 'Urgent' : 'Not Urgent'
      }, ${task.important ? 'Important' : 'Not Important'}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await window.electronAPI.deleteTask(index);
        loadTasks();
      });
      taskItem.appendChild(deleteButton);
      tasksList.appendChild(taskItem);
    });
  }

  loadTasks();

  backButton.addEventListener('click', () => {
    window.location.href = './index.html';
  });
}
