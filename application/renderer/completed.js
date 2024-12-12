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
