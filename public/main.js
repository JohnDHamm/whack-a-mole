'use strict'

const socket = io()

const board = document.querySelector('.board');
const scoreDiv = document.querySelector('.scoreDiv')
// const start = document.querySelector('.start');


const drawBoard = (b) => {
  board.innerHTML = `
    <table>
      <tr>
        <td>${b[0][0]}</td>
        <td>${b[0][1]}</td>
        <td>${b[0][2]}</td>
      </tr>
      <tr>
        <td>${b[1][0]}</td>
        <td>${b[1][1]}</td>
        <td>${b[1][2]}</td>
      </tr>
    </table>
  `
}

//hail mary
const emptyBoard = [['','',''],['','','']]

drawBoard(emptyBoard)

const writeScore = (score) => {
  scoreDiv.innerHTML = `<h1> Player 1 Score: ${score}</h1>`
}

writeScore(0)
board.addEventListener('click', evt => {
  const col = evt.target.cellIndex
  const row = evt.target.closest('tr').rowIndex
  // console.log("clicked on row: ", row);
  // console.log("clicked on col: ", col);

  let clickedHole = { row, col };
  // console.log("clickedHole", clickedHole);
  socket.emit('check whack', { row, col })
})

// start.addEventListener('click', evt => {
// 	socket.emit('start game', {})
// 	// startGame();
// })


socket.on('update board', gameBoard => drawBoard(gameBoard))
socket.on('update score', score => writeScore(score))
socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect', () => console.log('Socket disconnected'))



