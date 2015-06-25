var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');

var app = express();
var router = require('./router');

app.use(bodyParser.json());
app.use('/', router);
app.listen(config.app.port);
