const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');
const axios = require("axios");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

app.get('/channel', async (req, res) => {
  try {
    const channel = await getChannelWithHighestPoints();
    res.json({ channel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getChannelWithHighestPoints() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: '<username>',
    password: '<password>',
    database: 'twitch'
  });

  const [rows, fields] = await connection.execute('SELECT channel FROM channels ORDER BY points DESC');
  await connection.end();
  for (let i = 0; i < rows.length; i++) {
    try {
      const res = await axios.get('https://api.twitch.tv/helix/streams?user_login=' + rows[i].channel, {
        headers: {
          Authorization: 'Bearer <Your_Token>',
          'Client-ID': '<Your Client-ID>'
        }
      });
      if (res.data.data[0].type === "live") {
        return rows[i].channel;
      }
    } catch (err) {
    }
  }
}

app.listen(8080, () => {
  console.log('Server started on port 8080');
});