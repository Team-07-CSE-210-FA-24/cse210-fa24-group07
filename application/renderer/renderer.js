const taskForm = document.getElementById("task-form");
const addTaskButton = document.getElementById("add-task-button");
const deleteSelectedButton = document.getElementById("delete-selected-button");
const backButton = document.getElementById("back-button");
const saveTaskButton = document.getElementById("save-task-button");

let selectedTasks = {}; // Track selected tasks for deletion

function updateDeleteButtonVisibility() {
	const hasSelectedTasks = Object.keys(selectedTasks).length > 0;
	deleteSelectedButton.style.display = hasSelectedTasks
		? "inline-block"
		: "none";
}

async function loadMatrix() {
	const tasks = await window.electronAPI.getTasks();
	selectedTasks = {}; // Reset selected tasks
	updateDeleteButtonVisibility(); // Ensure button is hidden initially

	for (const [quadrant, taskList] of Object.entries(tasks)) {
		const quadrantEl = document.getElementById(quadrant)?.querySelector("ul");
		if (quadrantEl) {
			quadrantEl.innerHTML = "";

			// Task name
			const taskText = document.createElement("button");
			taskText.textContent = task.name;

			// Edit button
			const editButton = document.createElement("button");
			editButton.textContent = "Edit";
			editButton.style.marginLeft = "10px";
			editButton.style.color = "white";
			editButton.style.backgroundColor = "#ff4d4d";
			editButton.style.border = "none";
			editButton.style.borderRadius = "5px";
			editButton.style.padding = "3px 7px";
			editButton.style.cursor = "pointer";

			editButton.addEventListener("click", async () => {
				localStorage.setItem("taskName", task.name);
				localStorage.setItem("taskId", index);
				localStorage.setItem("quadrant", quadrant);
				window.location.href = "./edit-task.html";
			});

			// Sort tasks by deadline (earliest first)
			const sortedTasks = taskList.sort((a, b) => {
				if (!a.deadline && !b.deadline) return 0;
				if (!a.deadline) return 1;
				if (!b.deadline) return -1;
				return new Date(a.deadline) - new Date(b.deadline);
			});

			sortedTasks.forEach((task, index) => {
				const taskItem = document.createElement("li");

				// Checkbox for task
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.addEventListener("change", (e) => {
					if (e.target.checked) {
						if (!selectedTasks[quadrant]) selectedTasks[quadrant] = [];
						selectedTasks[quadrant].push(index);
					} else {
						selectedTasks[quadrant] = selectedTasks[quadrant].filter(
							(i) => i !== index,
						);
						if (selectedTasks[quadrant].length === 0)
							delete selectedTasks[quadrant];
					}
					updateDeleteButtonVisibility(); // Update button visibility on checkbox change
				});

				// Task name with deadline
				const taskText = document.createElement("span");
				const deadline = task.deadline
					? ` (${(new Date(task.deadline).getMonth() + 1)
							.toString()
							.padStart(
								2,
								"0",
							)}/${new Date(task.deadline).getDate().toString().padStart(2, "0")})`
					: "";
				taskText.textContent = `${task.name}${deadline}`;

				taskItem.appendChild(checkbox);
				taskItem.appendChild(taskText);

				taskItem.appendChild(deleteButton);
				taskItem.appendChild(editButton);
				quadrantEl.appendChild(taskItem);
			});
		}
	}
}

// Delete selected tasks
if (deleteSelectedButton) {
	deleteSelectedButton.addEventListener("click", async () => {
		for (const [quadrant, indices] of Object.entries(selectedTasks)) {
			const sortedIndices = indices.sort((a, b) => b - a);
			for (const index of sortedIndices) {
				window.electronAPI.deleteTask(quadrant, index);
			}
		}
		await loadMatrix(); // Reload matrix after deletion
	});
}

// Navigate to add task page
if (addTaskButton) {
	addTaskButton.addEventListener("click", () => {
		window.location.href = "./add-task.html";
	});
}

// Add task and return to matrix view
if (taskForm) {
	taskForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const name = document.getElementById("task-name").value;
		const urgent = document.getElementById("urgent").checked;
		const important = document.getElementById("important").checked;
		const deadline = document.getElementById("deadline").value;

		await window.electronAPI.addTask({ name, urgent, important, deadline });
		taskForm.reset();
	});
	backButton.addEventListener("click", () => {
		window.location.href = "./view.html";
	});
}

if (saveTaskButton) {
	saveTaskButton.addEventListener("click", async () => {
		const quadrant = localStorage.getItem("quadrant");
		const index = localStorage.getItem("taskId");
		await window.electronAPI.deleteTask(quadrant, index);
		const name = document.getElementById("edit-task-name").value;
		const urgent = document.getElementById("edit-urgent").checked;
		const important = document.getElementById("edit-important").checked;
		await window.electronAPI.addTask({ name, urgent, important });
		loadMatrix();
		window.location.href = "./view.html";
	});
}

// Load matrix tasks on matrix page
if (document.getElementById("matrix")) {
	loadMatrix();
}
