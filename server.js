'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(express.static('public'));

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

