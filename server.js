const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');
const axios = require("axios");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:username', async (req, res) => {
  const username = req.params.username;
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

const pool = mysql.createPool({
  host: '192.168.178.66',
  user: 'remote',
  password: 'Max69546463272386954',
  database: 'twitch'
});

async function getChannelWithHighestPoints(username) {
  const [rows] = await pool.execute('SELECT channel FROM channels WHERE username = ? ORDER BY points DESC', [username]);
  for (var i = 0; i < rows.length; i++) {
    const channel = rows[i].channel;
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
app.get('/channel/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const channel = await getChannelWithHighestPoints(username);
    if (channel) {
      res.json({ channel });
    } else {
      throw new Error("No live channels found.");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(999, '0.0.0.0', () => {
  console.log('Server started on port 999');
});