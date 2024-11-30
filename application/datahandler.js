// dataHandler.js
const fs = require('node:fs');
const path = require('node:path');
const { app } = require('electron');
class DataHandler {
  constructor() {
    this.filePath = path.join(app.getPath('userData'), 'tasks.json');
  }
  // Read all tasks from file
  readTasks() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading tasks:', error);
      return [];
    }
  }
  // Write tasks to file
  writeTasks(tasks) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing tasks:', error);
      return false;
    }
  }
  // Add a single task
  addTask(task) {
    try {
      const tasks = this.readTasks();
      tasks.push(task);
      return this.writeTasks(tasks);
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  }
  // Update a single task
  updateTask(index, updatedTask) {
    try {
      const tasks = this.readTasks();
      tasks[index] = updatedTask;
      return this.writeTasks(tasks);
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  }
  // Delete a single task
  deleteTask(index) {
    try {
      const tasks = this.readTasks();
      tasks.splice(index, 1);
      return this.writeTasks(tasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
}
module.exports = DataHandler;
