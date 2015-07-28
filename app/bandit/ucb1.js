var async = require('neo-async');

var ucb1Dao = require('../../dao/bandit_model/ucb1');

var create = function (armNames, numArms, settings, callback) {
	async.waterfall([
		function (next) {
			if (armNames) {
				ucb1Dao.createByArmNames(armNames, function (error, model) {
					next(error, model);
				});
			} else {
				ucb1Dao.createByNumArms(numArms, function (error, model) {
					next(error, model);
				});
			}
		}
	], function (error, model) {
		if (error) return callback(error, {});

		callback(error, model);
	});
};

var get = function (model, callback) {
	callback(null, {});
};

var insert = function (model, armId, reward, callback) {
	callback(null, {});
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
