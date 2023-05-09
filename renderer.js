const { ipcRenderer } = require('electron');

ipcRenderer.on('channel-url', (event, channelUrl) => {
    console.log(channelUrl);
    const webview = document.getElementById('twitch-player');
    console.log(channelUrl);
    webview.setAttribute('src', `https://player.twitch.tv/?channel=${channelUrl}&muted=false&parent=localhost`);
    console.log(channelUrl);
    console.log(webview.getAttribute('src'));
});