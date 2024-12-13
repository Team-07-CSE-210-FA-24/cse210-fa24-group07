jest.mock('electron-store', () => {
    return jest.fn().mockImplementation(() => ({
      get: jest.fn(() => ({
        quadrant1: [],
        quadrant2: [],
        quadrant3: [],
        quadrant4: []
      })),
      set: jest.fn()
    }));
  });
  
  jest.mock('electron', () => {
    const trayMock = {
      setContextMenu: jest.fn(),
      on: jest.fn()
    };
  
    const bwMock = jest.fn(() => ({
      loadFile: jest.fn(),
      on: jest.fn()
    }));
  
    return {
      BrowserWindow: bwMock,
      app: {
        whenReady: jest.fn().mockResolvedValue(),
        on: jest.fn(),
        quit: jest.fn()
      },
      ipcMain: { handle: jest.fn() },
      globalShortcut: { register: jest.fn(() => true) },
      Tray: jest.fn(() => trayMock),
      Menu: {
        buildFromTemplate: jest.fn(() => ({}))
      },
      nativeImage: { createFromPath: jest.fn() }
    };
  });
  
  describe('main process', () => {
    let electron;
  
    beforeAll(() => {
      jest.isolateModules(() => {
        electron = require('electron'); // Re-import Electron with mocks applied
        require('../main'); // Run main.js to initialize app
      });
    });
  
    it('should create a BrowserWindow after the app is ready', async () => {
      const { app, BrowserWindow } = electron;
  
      // Simulate app ready
      await app.whenReady();
  
      // Verify that BrowserWindow was created
      expect(BrowserWindow).toHaveBeenCalledTimes(1);
  
      // Check the arguments passed to BrowserWindow
      const browserWindowOptions = BrowserWindow.mock.calls[0][0];
      expect(browserWindowOptions).toMatchObject({
        width: 800,
        height: 600,
        webPreferences: expect.objectContaining({
          preload: expect.any(String),
          nodeIntegration: false,
          contextIsolation: true
        })
      });
    });
  });