const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cheerio = require('cheerio');
let currentStreamer;
let showChat = true;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      webviewTag: true,
      contextIsolation: true,
    }
  });
  mainWindow.loadFile('index.html');

  const menu = Menu.getApplicationMenu();
  const viewMenuItem = menu.items.find(item => item.label === 'View');
  for (let i = 0; i < viewMenuItem.submenu.items.length; i++) {
    if (viewMenuItem.submenu.items[i].role === 'togglefullscreen') {
      viewMenuItem.submenu.insert(
        i,
        new MenuItem({
          label: 'Show Chat',
          type: 'checkbox',
          checked: true,
          click: () => {
            toggleChat(mainWindow);
          }
        })
      );
      break;
    }
  }
  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('did-finish-load', async () => {
    await updateStream(mainWindow);
    setInterval(() => {
      updatePlayer(mainWindow);
    }, 5 * 60 * 1000);
  });
}

function toggleChat(mainWindow) {
  showChat = !showChat;
  let code = `
      try {
        const video = document.getElementById('twitchPlayer');
        const chat = document.getElementById('twitchChat');
        if (${showChat}) {
          video.style.width = '80%';
          chat.style.width = '20%';
        } else {
          chat.style.width = '0%';
          video.style.width = '100%';
        }
      } catch (error) {
        console.error(error);
      } 
    `;
  mainWindow.webContents.executeJavaScript(code);
}

async function updateStream(mainWindow) {
  const newStreamer = await findStreamer();
  if (newStreamer != currentStreamer) {
    currentStreamer = newStreamer;
  }
  let code = `
      try {
        const video = document.getElementById('twitchPlayer');
        video.setAttribute('src', 'https://player.twitch.tv/?channel=${currentStreamer}&muted=false&parent=localhost');
        const chat = document.getElementById('twitchChat');
        chat.setAttribute('src', 'https://twitch.tv/embed/${currentStreamer}/chat?parent=localhost&theme=dark');
      } catch (error) {
        console.error(error);
      } 
    `;
  mainWindow.webContents.executeJavaScript(code);
}

async function findStreamer() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'twitch'
  });

  const [rows] = await connection.execute('SELECT channel FROM channels ORDER BY points asc');
  console.log(rows.length);
  for (let i = 0; i < rows.length; i++) {
    await axios.get('https://api.twitch.tv/helix/streams?user_login=' + rows[i].channel, {
      headers: {
        Authorization: 'Bearer zb6emapqazcp152scr5fn1iitptqm0',
        'Client-ID': '0g7u6yy07d0msxzh99kdh5idg2jmyk'
      }
    }).then(function (res) {
      let data = res.data.data[0];
      if (res.data.data[0].type === "live") {
        currentStreamer = rows[i].channel;
      }
    }).catch(function (err) {
    });
  }

  await connection.end();

  return currentStreamer;
}

app.whenReady().then(() => { createWindow() });