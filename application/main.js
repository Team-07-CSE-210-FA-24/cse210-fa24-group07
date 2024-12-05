const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path'); // 使用现代 Node.js 路径模块

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
    const fullTask = { ...task, notes: task.notes || '' }; // 确保任务有默认的 notes 属性
    if (task.urgent && task.important) tasks.quadrant1.push(fullTask);
    else if (!task.urgent && task.important) tasks.quadrant2.push(fullTask);
    else if (task.urgent && !task.important) tasks.quadrant3.push(fullTask);
    else tasks.quadrant4.push(fullTask);
    return tasks;
  });

  ipcMain.handle('get-tasks', () => tasks);

  ipcMain.handle('delete-task', (event, { quadrant, index }) => {
    tasks[quadrant].splice(index, 1); // 从指定象限中移除任务
    return tasks;
  });

  ipcMain.handle('get-notes', (event, { quadrant, index }) => {
    console.log('get-notes received:', { quadrant, index });

    if (!tasks[quadrant]) {
      console.error(`Invalid quadrant: ${quadrant}`);
      return '';
    }

    if (!tasks[quadrant][index]) {
      console.error(`Invalid index: ${index} for quadrant: ${quadrant}`);
      return '';
    }

    return tasks[quadrant][index]?.notes || ''; // 返回任务的 notes，默认为空字符串
  });

  ipcMain.handle('update-notes', (event, { quadrant, index, notes }) => {
    console.log('update-notes called with:', { quadrant, index, notes });

    if (tasks[quadrant] && tasks[quadrant][index]) {
      tasks[quadrant][index].notes = notes; // 更新任务的 notes
    } else {
      console.error(`Invalid quadrant or index for update: ${quadrant}, ${index}`);
    }
    return tasks;
  });
});