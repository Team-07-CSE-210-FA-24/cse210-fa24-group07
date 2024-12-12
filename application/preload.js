/**
 * Preload script for the Electron application.
 * 
 * This script acts as a secure bridge between the renderer process (frontend) and the main process,
 * exposing a limited set of functionalities to the renderer through the `contextBridge` API.
 * 
 * Key functionalities exposed to the renderer:
 * - `getNotes`: Fetches notes for a specific task based on its quadrant and index.
 * - `updateNotes`: Updates the notes for a specific task.
 * - `addTask`: Adds a new task to the appropriate category.
 * - `getTasks`: Retrieves the current list of tasks in all categories.
 * - `deleteTask`: Deletes a task from a specific quadrant based on its index.
 * - `completeTask`: Moves selected tasks to the "completed" category.
 * - `getCompletedTasks`: Retrieves all completed tasks.
 * - `deleteCompletedTask`: Deletes a task from the "completed" category based on its index.
 * 
 * The script uses `ipcRenderer.invoke` for asynchronous communication with the main process,
 * ensuring that sensitive operations are handled securely in the main process and only
 * necessary methods are exposed to the renderer process.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getNotes: (params) => ipcRenderer.invoke('get-notes', params),
  updateNotes: (params) => ipcRenderer.invoke('update-notes', params),
  addTask: (task) => ipcRenderer.invoke('add-task', task),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  deleteTask: (quadrant, index) =>
    ipcRenderer.invoke('delete-task', { quadrant, index }),
  completeTask: (selectedTasks) =>
    ipcRenderer.invoke('complete-task', selectedTasks),
  getCompletedTasks: () => ipcRenderer.invoke('get-completed-tasks'),
  deleteCompletedTask: (index) =>
    ipcRenderer.invoke('delete-completed-task', index),
});
