const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'twitch'
});

connection.connect((err) => {
    if (err) throw err;
});

function getChannelUrl(callback) {
    connection.query('SELECT channel FROM channels ORDER BY points LIMIT 1', (err, result) => {
        if (err) throw err;
        callback(result[0].channel);
    });
}

module.exports = { getChannelUrl };
