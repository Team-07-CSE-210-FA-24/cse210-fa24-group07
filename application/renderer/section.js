function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const sectionId = getQueryParam('id');
const backButton = document.getElementById('back-button');
const pageHeading = document.querySelector('h1');
const sectionTasks = await window.electronAPI.getTasks()
  .then(tasks => tasks[sectionId]);
const sectionTaskList = document.getElementById('task-list');

if (sectionId == 'quadrant1') {
    document.body.style.backgroundColor = '#4caf50';
    pageHeading.textContent = '✅ Do';
} else if (sectionId == 'quadrant2') {
    document.body.style.backgroundColor = '#ff9800';
    pageHeading.textContent = '📅 Schedule';
} else if (sectionId == 'quadrant3') {
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

console.log(sectionTasks);
for (const task of sectionTasks) {
  const taskElement = document.createElement('li');
  taskElement.innerText = task.name;
  sectionTaskList.appendChild(taskElement);
}
