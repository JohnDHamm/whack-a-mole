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

app.use(express.static('public'));

// set up mongoDB
mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
  server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
})

io.on('connect', socket => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log('Socket disconnected'))
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

// creates a new Game object in the mongo DB with the default value from the Game model
// the whole document that was just created is returned from the DB from the create function
// and can be used after the then statement
Game.create({}).then(game => console.log("game", game));
