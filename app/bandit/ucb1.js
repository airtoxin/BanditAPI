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
	var arm = _.find(model.arms, function (arm) {
		return '' + arm._id === armId;
	});
	var n = ++arm.counts;
	var value = arm.value;

	var newValue = ((n - 1) / n * value + (1 / n)) * reward;
	ucb1Dao.updateArmWithValue(model._id, armId, newValue, function (error) {
		callback(error);
	});
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
