'use strict'

const board = document.querySelector('.board');

const gameBoard = [['','',''],['','','']]

let score = 0
let turnCtr = 1

board.addEventListener('click', evt => {
  const col = evt.target.cellIndex
  const row = evt.target.closest('tr').rowIndex
  // console.log("clicked on row: ", row);
  // console.log("clicked on col: ", col);

  // socket.emit('make move', { row, col })
  let clickedHole = { row, col };
  console.log("clickedHole", clickedHole);
  console.log(checkWhack(clickedHole));
  console.log('Score:', score)


})

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

// drawBoard(gameBoard)

const makeMole = function() {
	const rndRow = Math.floor(Math.random() * 2);
	const rndCol = Math.floor(Math.random() * 3);
	gameBoard[rndRow][rndCol] = 'X';
	return gameBoard;
}

const checkWhack = (clickedHole) => {
	if (gameBoard[clickedHole.row][clickedHole.col]) {
    score++
		return 'whack!!!';
	}
  score--
	return 'miss!'
}

function startGame() {
  let id = setInterval(turn, 1000)
  function turn() {
    if(turnCtr > 5) {
      clearInterval(id)
      console.log('Fuck you interval')
    }
    else {
      console.log(turnCtr)
      const board = makeMole();
      drawBoard(board);
      turnCtr++
    }
  }
}

startGame()
 

