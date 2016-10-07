'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/whack-a-mole'


app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

app.use(express.static('public'));

// set up mongoDB
mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () => {
  app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
})

// set up game model for DB
const Game = mongoose.model('game', {
  board: {
    type: [
      [String, String, String],
      [String, String, String],
    ],
    default: [
      ['', '', 'X'],
      ['', '', ''],
    ]
  }
})

// creates a new Game object in the mongo DB with the default value from the Game model
// the whole document that was just created is returned from the DB from the create function
// and can be used after the then statement
Game.create({}).then(game => console.log("game", game));
