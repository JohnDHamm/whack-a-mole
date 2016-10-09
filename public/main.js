'use strict'

const socket = io()

const board = document.querySelector('.board');
const scoreDiv = document.querySelector('.scoreDiv')

const drawBoard = (b) => {
  board.innerHTML = `
    <table>
      <tr>
        <td><img src='${b[0][0]}' class='moleImg'</td>
        <td><img src='${b[0][1]}' class='moleImg'</td>
        <td><img src='${b[0][2]}' class='moleImg'</td>
      </tr>
      <tr>
        <td><img src='${b[1][0]}' class='moleImg'</td>
        <td><img src='${b[1][1]}' class='moleImg'</td>
        <td><img src='${b[1][2]}' class='moleImg'</td>
      </tr>
    </table>
  `
}

const emptyBoard = [['/img/blank.png','/img/blank.png','/img/blank.png'],['/img/blank.png','/img/blank.png','/img/blank.png']]

const writeScore = (score) => {
  scoreDiv.innerHTML = `<h1> Player 1 Score: ${score}</h1>`
}

drawBoard(emptyBoard)
writeScore(0)

board.addEventListener('click', evt => {
  const col = evt.target.parentNode.cellIndex
  const row = evt.target.closest('tr').rowIndex
  // console.log("clicked on row: ", row);
  // console.log("clicked on col: ", col);
  socket.emit('check whack', { row, col })
})


socket.on('update board', gameBoard => drawBoard(gameBoard))
socket.on('update score', score => writeScore(score))
socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect', () => console.log('Socket disconnected'))



