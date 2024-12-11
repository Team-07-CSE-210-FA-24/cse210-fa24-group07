const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getNotes: (params) => ipcRenderer.invoke('get-notes', params),
  updateNotes: (params) => ipcRenderer.invoke('update-notes', params),
  addTask: (task) => ipcRenderer.invoke('add-task', task),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  deleteTask: (quadrant, index) => ipcRenderer.invoke('delete-task', { quadrant, index }),
  completeTask: (selectedTasks) => ipcRenderer.invoke('complete-task', selectedTasks),
  getCompletedTasks: () => ipcRenderer.invoke('get-completed-tasks'),
  deleteCompletedTask: (index) => ipcRenderer.invoke('delete-completed-task', index),
});
