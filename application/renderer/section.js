function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const sectionId = getQueryParam('id');
const backButton = document.getElementById('back-button');
const pageHeading = document.querySelector('h1');
const sectionTasks = await window.electronAPI
  .getTasks()
  .then((tasks) => tasks[sectionId]);
const sectionTaskList = document.getElementById('task-list');

if (sectionId === 'quadrant1') {
  console.log('1');
  document.body.style.backgroundColor = '#4caf50';
  pageHeading.textContent = '✅ Do';
} else if (sectionId === 'quadrant2') {
  document.body.style.backgroundColor = '#ff9800';
  pageHeading.textContent = '📅 Schedule';
} else if (sectionId === 'quadrant3') {
  document.body.style.backgroundColor = '#2196f3';
  pageHeading.textContent = '📤 Delegate';
} else {
  document.body.style.backgroundColor = '#6c757d';
  pageHeading.textContent = '❌ Delete';
}

if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = './view.html';
  });
}

for (const [index, task] of sectionTasks.entries()) {
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
    await window.electronAPI.deleteTask(sectionId, index);
    location.reload();
  });
  taskItem.appendChild(taskText);
  taskItem.appendChild(deleteButton);
  sectionTaskList.appendChild(taskItem);
}
