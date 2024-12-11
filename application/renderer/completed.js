document.getElementById('back-to-view').addEventListener('click', () => {
    window.location.href = './view.html';
  });
  
  async function loadCompletedTasks() {
    const completedTasks = await window.electronAPI.getCompletedTasks();
    const completedList = document.getElementById('completed-list');
    completedList.innerHTML = '';
  
    completedTasks.forEach((task, i) => {
      const li = document.createElement('li');
  
      // Task header (name + deadline)
      const taskHeader = document.createElement('div');
      taskHeader.classList.add('task-header');
      const deadline = task.deadline
        ? ` (${(new Date(task.deadline).getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${new Date(task.deadline)
            .getDate()
            .toString()
            .padStart(2, '0')})`
        : '';
      taskHeader.textContent = `${task.name}${deadline}`;
      li.appendChild(taskHeader);
  
      // Show original category
      if (task.category) {
        const categoryElem = document.createElement('div');
        categoryElem.classList.add('task-category');
        categoryElem.textContent = `Category: ${task.category}`;
        li.appendChild(categoryElem);
      }
  
      // Button row
      const buttonRow = document.createElement('div');
      buttonRow.classList.add('button-row');
  
      // View Task button - goes to notes.html in read-only completed mode
      const viewTaskButton = document.createElement('button');
      viewTaskButton.textContent = 'View Task';
      viewTaskButton.addEventListener('click', () => {
        // Navigate to notes.html in view mode, with completed=true
        // quadrant=completed since the task is in the completed array
        window.location.href = `./notes.html?quadrant=completed&index=${i}&mode=view&completed=true`;
      });
      buttonRow.appendChild(viewTaskButton);
  
      // Delete button for completed tasks
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
  