const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;
const tasks = {
  quadrant1: [], 
  quadrant2: [],
  quadrant3: [], 
  quadrant4: [], 
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

    const fullTask = { ...task, notes: task.notes || '' }; 
    if (task.urgent && task.important) tasks.quadrant1.push(fullTask);
    else if (!task.urgent && task.important) tasks.quadrant2.push(fullTask);
    else if (task.urgent && !task.important) tasks.quadrant3.push(fullTask);
    else tasks.quadrant4.push(fullTask);
    return tasks;
  });

  ipcMain.handle('get-tasks', () => tasks);

  ipcMain.handle('delete-task', (event, { quadrant, index }) => {
    tasks[quadrant].splice(index, 1);
    return tasks;
  });


  ipcMain.handle('get-notes', (event, { quadrant, index }) => {
    return tasks[quadrant][index]?.notes || ''; 
  });

  ipcMain.handle('update-notes', (event, { quadrant, index, notes }) => {
    tasks[quadrant][index].notes = notes; 
    return tasks;
  });
});