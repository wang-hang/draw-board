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

    let status = ''
    let preX = ''
    let preY = ''

    function beginDraw(e) {
      status = DRAWING
      const { x, y } = utils.getXY(e.clientX, e.clientY)
      preX = x
      preY = y
    }

    function endDraw(e) {
      status = ''
    }

    function draw(e) {
      if(status !== DRAWING) return;
      const { x, y } = utils.getXY(e.clientX, e.clientY)
      log(`当前鼠标坐标是 X:${x} Y:${y}`)

      ctx.beginPath()
      ctx.moveTo(preX, preY)
      ctx.lineTo(x, y)
      ctx.closePath()
      ctx.stroke()

      preX = x
      preY = y

    }

    function clearBoard() {
      ctx.clearRect(0,0, W,H)
    }


    const utils = {
      getXY(clientX, clientY) {
        return {
          x: clientX - boardX,
          y: clientY - boardY,
        }
      }
    }

  


    board.addEventListener('mousedown', beginDraw)
    board.addEventListener('mouseup', endDraw)
    board.addEventListener('mousemove', draw)
    document.getElementById('clear-btn').addEventListener('click', clearBoard)
  }
})()