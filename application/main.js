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

/*
 * Prevent the application from starting during initial installation
 * Refer https://www.electronforge.io/config/makers/squirrel.windows for details
 */
if (require('electron-squirrel-startup')) app.quit();

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
    if (!tasks[quadrant]?.[index]) {
      console.error(`Invalid quadrant or index: ${quadrant}, ${index}`);
      return '';
    }
    return tasks[quadrant][index].notes || '';
  });

  ipcMain.handle('update-notes', (event, { quadrant, index, notes }) => {
    if (tasks[quadrant]?.[index]) {
      tasks[quadrant][index].notes = notes;
    } else {
      console.error(`Invalid quadrant or index: ${quadrant}, ${index}`);
    }
    return tasks;
  });

  // Global Shortcut
  const ret = globalShortcut.register('CmdOrCtrl+Alt+T', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  if (!ret) {
    console.error('Failed to register global shortcut.');
  }

  // Tray
  const trayIcon = new Tray(nativeImage.createFromPath(path.resolve(__dirname, 'icons/taskbar/icon.png')));
  trayIcon.setContextMenu(
    Menu.buildFromTemplate([
      {
        role: 'unhide',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      { role: 'quit' },
    ]),
  );
});
