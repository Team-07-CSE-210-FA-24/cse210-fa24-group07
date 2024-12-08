// jest.setup.js
require("@testing-library/jest-dom");
global.window.electronAPI = {
	addTask: jest.fn(),
	getTasks: jest.fn(() => Promise.resolve([])),
	deleteTask: jest.fn(),
};
