const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');
const DataHandler = require('./datahandler');

let mainWindow;
let dataHandler;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // For security
      contextIsolation: true,
    },
  });
  mainWindow.loadFile('./renderer/index.html');
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
    dataHandler.addTask(task);
  });

  ipcMain.handle('get-tasks', () => {
    return dataHandler.readTasks();
  });

  ipcMain.handle('delete-task', (event, index) => {
    dataHandler.deleteTask(index);
  });

  // Setup global shortcut Ctrl+Meta+T to show the app
  const ret = globalShortcut.register('Alt+CommandOrControl+T', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  if (!ret) {
    console.log('Could not register global shortcut.');
  }
});
