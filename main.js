const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initializeDatabase } = require('./database');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  win.loadFile('index.html').then(() => {
    console.log('index.html has been loaded');
  }).catch(err => {
    console.error('Failed to load index.html:', err);
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load content:', errorDescription);
  });

  win.webContents.openDevTools(); // Open DevTools for debugging
}

app.whenReady().then(() => {
  initializeDatabase(); // Initialize database when the app is ready
  createWindow(); // Create the browser window

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
