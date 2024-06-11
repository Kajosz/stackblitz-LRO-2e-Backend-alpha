// const express = require('express');
// const crypto = require('crypto');
// const app = express();
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');
// const server = createServer(app);
// const io = new Server(app);
// const port = process.env.PORT || 5000;

// const db = require("./serverCode/database.js");
// const wg = require("./serverCode/wanderersGuide.js")

// const io = require('socket.io')(port);
// console.log(`Port: ${port}.`)

// const characters = db.getCharactersIDs();
// const mailsDictionary = db.getMailsDictionary();
// const wgTokens = db.getTokens();
//const wgApiKey = FROM .env
//const frontEndUrl = FROM .env

//****** */

// const addingCodes = [];


// app.get('/', (req, res) => {
//   console.log('consolling test');
//   res.send("Hello, this is Let's Roll One backend. Nothing to do here. :) XDXD")
// });

// app.get('/new-char-code', (req, res) => {
//   const newCode = crypto.randomBytes(16).toString('hex');
//   addingCodes.push(newCode);
//   res.send(newCode);
// })

// app.get('/new-character', async (req, res) => wg.addNewCharacter(req, res, db, addingCodes, wgTokens));

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// server.listen(3000, () => {
//   console.log('Server Socketowy');
// });

// io.on('connection', (socket) => {
//   console.log("hello in the socket")

//   socket.on('disconnect', () => {})
//   socket.on('chat-message', message => {})
// })


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["https://lets-roll-one.netlify.app"]
  }
});
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.write(`<h1>HEJ! Socket IO Start on Port : ${PORT}</h1>`);
    res.end();
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('dzien Dobry?')
    socket.on('message', (ms) => {
        console.log('komunikacja')
        io.emit('message', ms);
    });
});

server.listen(PORT, () => {
    console.log('listening on ', PORT);
});
