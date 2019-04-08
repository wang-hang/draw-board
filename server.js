const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(3000)

app.use(express.static(__dirname + '/assets'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  let drawing = false

  socket.on('begin', function(data) {
    if(!drawing) {
      console.log('begin draw ');
      socket.broadcast.emit('beginDraw', data)
      drawing = true
    }
  })
  
  socket.on('draw', function(data) {
    if(drawing) {
      console.log('drawing ');
      socket.broadcast.emit('drawing', data)
    }
  })

  socket.on('end', function() {
    if(drawing) {
      socket.broadcast.emit('endDraw')
      console.log('end draw ');
    }
    drawing = false
  })


})

