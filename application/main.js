const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const DataHandler = require('./datahandler');

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
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer/view.html'));
}

app.whenReady().then(() => {

  createWindow();
  dataHandler = new DataHandler();

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

  ipcMain.handle('get-tasks', () => {
    return dataHandler.readTasks();
  });

  ipcMain.handle('delete-task', (event, { quadrant, index }) => {
    tasks[quadrant].splice(index, 1); // Remove task from the specified quadrant
    return tasks;
  });
});
