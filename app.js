var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require(path.join(__dirname, 'config'));

module.exports = function () {
	var app = express();
	var router = require('./router');

	app.use(bodyParser.json());
	app.use('/', router);
	app.listen(config.app.port);
	console.log('app listening port: ' + config.app.port);
};
