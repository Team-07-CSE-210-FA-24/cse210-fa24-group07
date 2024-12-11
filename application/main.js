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

if (require('electron-squirrel-startup')) app.quit();

let Store;
(async () => {
  const module = await import('electron-store');
  Store = module.default;

  const store = new Store();

  let mainWindow;
  let isQuitting = false;

  const tasks = store.get('tasks', {
    quadrant1: [],
    quadrant2: [],
    quadrant3: [],
    quadrant4: [],
    completed: [],
  });

  function saveTasks() {
    store.set('tasks', tasks);
  }

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

    function categorizeTask(task) {
      if (task.urgent && task.important) {
        return { key: 'quadrant1', category: 'Do' };
      }

      if (!task.urgent && task.important) {
        return { key: 'quadrant2', category: 'Schedule' };
      }

      if (task.urgent && !task.important) {
        return { key: 'quadrant3', category: 'Delegate' };
      }

      return { key: 'quadrant4', category: 'Tasks to delete' };
    }

    ipcMain.handle('add-task', (event, task) => {
      const fullTask = { ...task, notes: task.notes || '' };
      const { key, category } = categorizeTask(fullTask);
      fullTask.category = category;
      tasks[key].push(fullTask);
      saveTasks();
      return tasks;
    });

    ipcMain.handle('get-tasks', () => tasks);

    ipcMain.handle('delete-task', (event, { quadrant, index }) => {
      tasks[quadrant].splice(index, 1);
      saveTasks();
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
        saveTasks();
      } else {
        console.error(`Invalid quadrant or index: ${quadrant}, ${index}`);
      }
      return tasks;
    });

    ipcMain.handle('complete-task', (event, selectedTasks) => {
      for (const [quadrant, indices] of Object.entries(selectedTasks)) {
        indices.sort((a, b) => b - a);
        for (const index of indices) {
          const completedTask = tasks[quadrant].splice(index, 1)[0];
          if (completedTask) {
            tasks.completed.push(completedTask);
          }
        }
      }
      saveTasks();
      return tasks;
    });

    ipcMain.handle('get-completed-tasks', () => {
      return tasks.completed || [];
    });

    ipcMain.handle('delete-completed-task', (event, index) => {
      tasks.completed.splice(index, 1);
      saveTasks();
      return tasks.completed;
    });

    const ret = globalShortcut.register('CmdOrCtrl+Alt+T', () => {
      mainWindow.show();
      mainWindow.focus();
    });
    if (!ret) {
      console.error('Failed to register global shortcut.');
    }

    // Tray formatted as linter suggests
    const trayIcon = new Tray(
      path.resolve(__dirname, 'icons/taskbar/icon.png'),
    );
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
})();
