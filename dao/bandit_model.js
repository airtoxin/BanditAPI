var mongoose = require('mongoose');

var Model = mongoose.model('BanditModel', require('../database')('bandit_model'));

var findById = function (modelId, callback) {
	Model.findById({_id: modelId}).lean().exec(function (error, result) {
		callback(error, result);
	});
};

module.exports = {
	findById: findById
};
