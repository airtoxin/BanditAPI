#!/usr/bin/env node

var path = require('path');
var _ = require('lodash');
var options = require('commander');

var config = require(path.join(__dirname, 'config'));

var packageFile = require('./package');
var app = require('./app');

options.version(packageFile.version)
	.option('-c, --config <path>', 'set config path', '')
	.parse(process.argv);

if (options.config) {
	var configObj = require(options.config);
	config = _.merge(config, configObj);
}
app();
