const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//var path = require('path');
const port = process.env.PORT || 5000;

const db = require("./serverCode/database.js");
const req = require('express/lib/request.js');

const characters = db.getCharactersIDs();
const mailsDictionary = db.getMailsDictionary();
const wgTokens = db.getTokens();


app.get('/', (req, res) => {
  res.send("Hello, this is Let's Roll One backend. Nothing to do here.")
});

app.get('/new-character', (req, res) => {

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
