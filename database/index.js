var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
var config = require(path.join(__dirname, '..', 'config'));

var dsn = '';
_.each(config.mongo.servers, function (server) {
	if (dsn !== '') dsn += ',';
	dsn += 'mongodb://' + server.user + ':' + server.pswd + '@' + server.host + ':' + server.port + '/' + config.mongo.name;
});
if (config.mongo.rs_name) dsn += '?replicaSet=' + config.mongo.rs_name;

mongoose.connect(dsn, {
	server: {
		auto_reconnect: true
	}
});

module.exports = function (includeFile) {
	if (!includeFile) return;
	return require('./' + includeFile);
};
