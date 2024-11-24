const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (task) => ipcRenderer.invoke('add-task', task),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  deleteTask: (quadrant, index) =>
    ipcRenderer.invoke('delete-task', { quadrant, index }), // New method
});
