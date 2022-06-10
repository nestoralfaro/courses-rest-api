const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const common = require('./common');
const config = require('../config');
const api = require('./api');
const app = express();

//Logging
app.use(morgan(config.logLevel));

//Request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('static'));

//Mount Features
app.use('/api', api.router);
app.use(common.internalError);


module.exports = app;