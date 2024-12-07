const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
} = require('electron');
const path = require('node:path');

let mainWindow;
let isQuitting = false;
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
  // Minimize to tray on close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
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

  app.on('before-quit', () => {
    isQuitting = true;
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

  ipcMain.handle('delete-task', (event, { quadrant, index }) => {
    tasks[quadrant].splice(index, 1); // Remove task from the specified quadrant
    return tasks;
  });

  // Setup global shortcut Ctrl+Alt+T to show the app
  const ret = globalShortcut.register('CmdOrCtrl+Alt+T', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  if (!ret) {
    console.log('Could not register global shortcut.');
  }

  // Setup tray icon
  const trayIcon = new Tray(nativeImage.createEmpty());
  trayIcon.setContextMenu(
    Menu.buildFromTemplate([
      {
        role: 'unhide',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      {
        role: 'quit',
      },
    ]),
  );
});
