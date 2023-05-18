const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');

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
    user: 'root',
    password: 'password',
    database: 'twitch'
  });

  const [rows, fields] = await connection.execute('SELECT channel FROM channels ORDER BY points DESC LIMIT 1');
  await connection.end();

  if (rows.length > 0) {
    return rows[0].channel;
  } else {
    throw new Error('No channel found');
  }
}

app.listen(8080, () => {
  console.log('Server started on port 8080');
});