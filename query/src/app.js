const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const queryRouter = require('./routes/routes.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(queryRouter);

module.exports = app;