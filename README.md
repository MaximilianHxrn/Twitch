# Twitch
This tool allows you to run a service which always displays a twitch stream from your favorite streamers. It changes the stream if someone goes offline or a better rated streamer goes online.
## Installation
Download the code base from the latest tag
### Prerequisits
- Node.js
- npm
- MySQL Server

Run `npm install --save-dev` and start the app with `node server.js`

## Config
You are allowed to change this code:
```javascript
const connection = await mysql.createConnection({
    host: 'localhost',
    user: '<username>',
    password: '<password>',
    database: 'twitch'
});
```
and enter your credentials. Plus setup your table "channels" in the following way:
```SQL
CREATE TABLE 'channels' (
  'channel' varchar(100) DEFAULT NULL,
  'id' int(11) NOT NULL AUTO_INCREMENT,
  'points' int(11) DEFAULT NULL,
  PRIMARY KEY ('id')
);
```
If you have any improvement, feel free to contribute. If you like this project you can support me [here](https://paypal.me/Shabib309) :)
