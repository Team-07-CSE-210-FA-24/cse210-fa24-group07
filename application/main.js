const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
const tasks = {
  quadrant1: [], // Urgent and Important
  quadrant2: [], // Not Urgent but Important
  quadrant3: [], // Urgent but Not Important
  quadrant4: [], // Neither Urgent nor Important
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Adjusted to correct path
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer/view.html')); // Updated file path
}

app.whenReady().then(() => {
  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // IPC Handlers
  ipcMain.handle('add-task', (event, task) => {
    if (task.urgent && task.important) tasks.quadrant1.push(task);
    else if (!task.urgent && task.important) tasks.quadrant2.push(task);
    else if (task.urgent && !task.important) tasks.quadrant3.push(task);
    else tasks.quadrant4.push(task);
    return tasks;
  });

  ipcMain.handle('get-tasks', () => tasks);
});
