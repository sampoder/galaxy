/* 
Author: @sampoder

Purpose: this file is the server that handles websockets, it's essentially a router for messages sent via websockets.

node app.js
*/


const express = require('express')
const app = express()
const port = 3003

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // this serves the art display as a static file
})

let counter = 1 // this variable is used to assign unique IDs to every planet / particle

app.get('/join', (req, res) => { // QR code points to this route
  io.emit('newParticle', { id: counter }); // event is received by art display and triggers new particle
  counter += 1
  res.redirect(`/controls?id=${counter - 1}`) // this page here is the mobile control page
})

app.get('/controls', (req, res) => {
  res.sendFile(__dirname + '/controls.html'); // static page for controlling particles, need an id query parameter
})

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.use(express.static('public'))

// these events are all sent by controllers
// and then forwarded by this server

io.on('connection', (socket) => {
  console.log("new connection!")
  socket.on('toggleRepel', (msg) => {
    console.log("toggleRepel")
    socket.broadcast.emit('toggleRepel', msg);
  });
  
  socket.on('updateMass', (msg) => {
    console.log("updateMass")
    socket.broadcast.emit('updateMass', msg);
  });
  
  socket.on('triggerSplit', (msg) => {
    console.log("triggerSplit")
    socket.broadcast.emit('triggerSplit', msg);
    socket.broadcast.emit('hi');
  });
});
