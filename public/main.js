'use strict'

const board = document.querySelector('.board');

const gameBoard = [['','',''],['','','']]

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

const makeMole = () => {
	const rndRow = Math.floor(Math.random() * 2)
	const rndCol = Math.floor(Math.random() * 3)
	gameBoard[rndRow][rndCol] = 'X'
	drawBoard(gameBoard)
}

makeMole()
