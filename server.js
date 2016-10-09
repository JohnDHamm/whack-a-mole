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
let globalGameId

app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.get('/game/create', (req, res) => {
	Game.create({})
		.then( game => res.redirect(`/game/${game._id}`));
})

//redirects to any /game/* route
app.get('/game/:id', (req, res) => {
	// console.log("req", req.params.id);
	//render game.pug
	res.render('game');
	//:id is the key for req.params
	globalGameId = req.params.id
	startGame(globalGameId)
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
  socket.on('check whack', (clickedHole) => checkWhack(clickedHole))
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
		roundCtr = 1,
		timerInterval = 2000,
		maxRounds = 5;


function startGame(gameId) {
	console.log("starting new game", gameId);
	//get game from db - mongoose method
	Game.findById(gameId)
		//returns game object from db
		.then( game => {
			// console.log("gameFound: ", game);
			//update board
			emitBoard(game.board);
		  const intervalId = setInterval(round, timerInterval)
		  function round () {
		    if(roundCtr > maxRounds) {
		      clearInterval(intervalId)
		      console.log('Game over, muthafucker!')
		      roundCtr = 0;
		    } else {
		    	Promise.resolve()
						.then(() => clearBoard())
						.then(emptyBoard => updateDbBoard(emptyBoard, gameId))
						.then(gameObj => emitBoard(gameObj))
						.then(pause)
						.then(gameObj => makeMole(gameObj))
						.then(gameObj => updateDbBoard(gameObj, gameId))
						.then(gameObj => emitBoard(gameObj))
						.then(gameObj => {
			      	console.log("round: ", roundCtr);
							roundCtr++
						})
		    }
		  }
		})

}


//caution!!! - this blocks all processes for 500ms
const pause = (gameObj) => {
	console.log("pausing");
	var currentTime = new Date().getTime();
	while (currentTime + 500 >= new Date().getTime()) {};
	return gameObj
}

const makeMole = function(game) {
	//assign a "mole" to the board
	const rndRow = Math.floor(Math.random() * 2);
	const rndCol = Math.floor(Math.random() * 3);
	//add mole to board array
	// game.board[rndRow][rndCol] = '☃';
	game.board[rndRow][rndCol] = `/img/snowden1.png`;
	// game.board[rndRow][rndCol] = `/img/giphy.gif`;
	game.markModified('board') // trigger mongoose change detection
	// console.log("new mole game.board: ", game.board);
	return game
}

const clearBoard = () => {
	console.log("clearing board");
	const emptyBoard = { board: [['','',''],['','','']] } ;
	return emptyBoard
}

const emitBoard = (gameObj) => {
	//sends to sockets on front end
	io.emit('update board', gameObj.board)
	return gameObj
}

const updateDbBoard = (boardObj, gameId) => {
	// const newBoardObj = { boardArray }
	// console.log("sending board obj to db: ", boardObj);

	//send new board to update the db
	return Game
		//finds game on db by id, updates the game object with object passed + returns entire game object
		.findOneAndUpdate({_id: gameId}, boardObj, { upsert: true, new: true })
		.then(gameObj => {
			// console.log("get board back - gameObj: ", gameObj);
			return gameObj;
		})
}

const checkWhack = (clickedHole) => {

	//get the game object from the db
	Game.findById(globalGameId)
		//returns game object
		.then(gameObj => {
			console.log("clickedHole: ", clickedHole);
			let gameBoard = gameObj.board
			console.log("gameBoard: ", gameBoard);
			if (gameBoard[clickedHole.row][clickedHole.col] === `/img/snowden1.png`) {
		    score++
		    io.emit('update score', score)
				console.log('whack!!!');
				console.log(score)
			}else{
				score--
			  io.emit('update score', score)
				console.log('miss!')
				console.log(score)
			}

		})
}

// creates a new Game object in the mongo DB with the default value from the Game model
// the whole document that was just created is returned from the DB from the create function
// and can be used after the then statement
// Game.create({}).then(game => console.log("game", game));
