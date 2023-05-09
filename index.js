const { app, BrowserWindow } = require('electron');
const { getChannelUrl } = require('./db.js');
const { } = require('./renderer.js');

function createWindow(channelUrl) {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    },
  });
  win.loadFile("index.html");
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('channel-url', channelUrl);
  });
}

app.whenReady().then(() => {
  getChannelUrl((channelUrl) => {
    createWindow(channelUrl);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    getChannelUrl((channelUrl) => {
      createWindow(channelUrl);
    });
  }
});