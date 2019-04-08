const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(3000)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})
app.get('/index.js', function(req, res) {
  res.sendFile(__dirname + '/index.js')
})

app.get('/pen.png', function(req, res) {
  res.sendFile(__dirname + '/pen.png')
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

