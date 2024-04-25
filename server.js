const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');
const axios = require("axios");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

async function getChannelWithHighestPoints() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'remote',
    password: 'Max69546463272386954',
    database: 'twitch'
  });

  const [rows] = await connection.execute('SELECT channel FROM channels ORDER BY points DESC LIMIT 1');
  await connection.end();
  if (rows.length > 0) {
      const channel = rows[0].channel;
      try {
          const res = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
            headers: {
              Authorization: 'Bearer dmq0027p70jezurxlhssie4tqs5qpy',
              'Client-ID': '0g7u6yy07d0msxzh99kdh5idg2jmyk'
            }
          });
          if (res.data.data.length > 0 && res.data.data[0].type === "live") {
            return channel;
          }
      } catch (err) {
          console.error('Failed to fetch channel info:', err);
      }
  }
  return null;
}

// Existing /channel route should now call this function
app.get('/channel', async (req, res) => {
  try {
      const channel = await getChannelWithHighestPoints();
      if (channel) {
          res.json({ channel });
      } else {
          throw new Error("No live channels found.");
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.listen(999, () => {
  console.log('Server started on port 999');
  getChannelWithHighestPoints();
});