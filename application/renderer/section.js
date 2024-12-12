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
