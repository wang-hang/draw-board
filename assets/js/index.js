(function(){
  const log = console.log
  const H = 600 // 画板高度
  const W = 600 // 画板宽度

  window.onload = function() {
    const board = document.getElementById('draw') // 画板
    const ctx = board.getContext('2d')
    const DRAWING = 'DRAWING'
    const boardX = board.getBoundingClientRect().x // 画板左上角的坐标
    const boardY = board.getBoundingClientRect().y

    const socket = io.connect('http://localhost:3000')

    let status = ''
    let preX = ''
    let preY = ''
    let penWidth = 1;
    let iDrawing = false
    let remoteDrawing = false

    ctx.strokeStyle = "red"

    function leave() {
      iDrawing = false
    }
    function beginDraw(x, y) {
      preX = x
      preY = y
    }

    function draw(x, y) {
      ctx.beginPath()
      ctx.moveTo(preX, preY)
      ctx.lineTo(x, y)
      ctx.closePath()
      ctx.stroke()

      preX = x
      preY = y


    }

    function endDraw(e) {
      iDrawing = false
    }

    

    function clearBoard() {
      ctx.clearRect(0,0, W,H)
    }

    function boldPen() {
      ctx.lineWidth = ++penWidth
    }

    function shinPen() {
      if(penWidth === 1) return;
      ctx.lineWidth = --penWidth
    }


    const utils = {
      getXY(clientX, clientY) {
        return {
          x: clientX - boardX,
          y: clientY - boardY,
        }
      }
    }




    socket.on('beginDraw', function({x, y}) {
        beginDraw(x, y)
    })

    socket.on('drawing', function(data) {
      const { x, y } = data
      draw(x, y)
    })

    socket.on('endDraw', function() {
      endDraw()
    })
   


    board.addEventListener('mousedown', function(e){
      const { x, y } = utils.getXY(e.clientX, e.clientY)
      beginDraw(x, y)
      iDrawing = true
      socket.emit('begin', {preX: x, preY: y})
    })

    board.addEventListener('mousemove', function(e){
      if(iDrawing) {
        const { x,y } = utils.getXY(e.clientX, e.clientY)
        draw(x, y)
        socket.emit('draw', {preX, preY, x, y})
      }
    })

    board.addEventListener('mouseup', function(e) {
      endDraw()
      socket.emit('end')
    })
    
    board.addEventListener('mouseleave', leave)
    document.getElementById('clear-btn').addEventListener('click', clearBoard)
    document.getElementById('bold-pen').addEventListener('click', boldPen)
    document.getElementById('shin-pen').addEventListener('click', shinPen)
  }
})()