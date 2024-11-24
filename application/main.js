const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');

let mainWindow;
const tasks = []; // In-memory storage for tasks

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
    tasks.push(task);
  });

  ipcMain.handle('get-tasks', () => tasks);

  ipcMain.handle('delete-task', (event, index) => {
    tasks.splice(index, 1);
  });

  // Setup global shortcut Ctrl+Meta+T to show the app
  const ret = globalShortcut.register('CmdOrCtrl+Meta+T', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  if (!ret) {
    console.log('Could not register global shortcut.');
  }
});
