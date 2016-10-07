'use strict';

const express = require('express');
const { Server } = require('http')
const mongoose = require('mongoose');
const socketio = require('socket.io')

//app creates an instance of express
//server creates an instance of Server from http, and passes in app
//io creates an instance of socketio, and passes in server
const app = express();
const server = Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/whack-a-mole'


app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.get('/game/create', (req, res) => {
	Game.create({})
		.then( game => res.redirect(`/game/${game._id}`));
})

app.get('/game/:id', (req, res) => {
	// console.log("req", req.params.id);
	res.render('game');
	startGame(req.params.id)
})


app.use(express.static('public'));

// set up mongoDB
mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
  server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
})

io.on('connect', socket => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log('Socket disconnected'))

  socket.on('start game', () => startGame())
})

// set up game model for DB
const Game = mongoose.model('game', {
  board: {
    type: [
      [String, String, String],
      [String, String, String],
    ],
    default: [
      ['', '', ''],
      ['', '', ''],
    ]
  }
})

let score = 0,
		turnCtr = 1,
		timerInterval = 2000;


const makeMole = function() {
	//assign a "mole" to the board
	const rndRow = Math.floor(Math.random() * 2);
	const rndCol = Math.floor(Math.random() * 3);

	//update the db with new board

	gameBoard[rndRow][rndCol] = 'X';
	return gameBoard;
	// timerInterval -= 250;
}

function startGame(gameId) {
	console.log("starting new game", gameId);
	//get game from db
	Game.findById(gameId)
		.then( game => {
			console.log("gameFound: ", game);
			//update board
			updateBoard(game.board);
		  let id = setInterval(turn, timerInterval)
		  function turn() {
		    if(turnCtr > 10) {
		      clearInterval(id)
		      console.log('Game over, muthafucker!')
		    } else {
		      clearBoard();
		      console.log("turn: ", turnCtr)
		      const board = makeMole();
		      // drawBoard(board);
		      turnCtr++
		    }
		  }
		})

}

const clearBoard = () => {
	console.log("clearing board");
	const emptyBoard = [['','',''],['','','']];
	// update db with new board
	updateDbBoard(emptyBoard)
}

const updateBoard = (board) => {
	io.emit('update board', board)
}

const updateDbBoard = (board) => {
	//send new board to update the db
	// Game.save()
	// 	.then ( game => {
	// 		return game.board
	// 	})
}

// creates a new Game object in the mongo DB with the default value from the Game model
// the whole document that was just created is returned from the DB from the create function
// and can be used after the then statement
// Game.create({}).then(game => console.log("game", game));
