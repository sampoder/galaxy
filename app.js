const express = require('express')
const app = express()
const port = 3003

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

let counter = 1

app.get('/join', (req, res) => {
  io.emit('newParticle', { id: counter });
  counter += 1
  res.redirect(`/controls?id=${counter - 1}`)
})

app.get('/controls', (req, res) => {
  res.sendFile(__dirname + '/controls.html');
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static('public'))

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