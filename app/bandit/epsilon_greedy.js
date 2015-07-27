var _ = require('lodash');
var async = require('neo-async');

var epsilonGreedyDao = require('../../dao/bandit_model/epsilon_greedy');

var create = function (armNames, numArms, settings, callback) {
	var epsilon = settings.epsilon;

	async.waterfall([
		function (next) {
			if (!_.isNumber(epsilon) || _.isNaN(epsilon) || epsilon < 0 || epsilon > 1) return next(new Error('invalid epsilon'));
			next();
		},
		function (next) {
			if (armNames) {
				epsilonGreedyDao.createByArmNames(armNames, epsilon, function (error, model) {
					next(error, model);
				});
			} else {
				epsilonGreedyDao.createByNumArms(numArms, epsilon, function (error, model) {
					next(error, model);
				});
			}
		},
	], function (error, model) {
		if (error) return callback(error, {});

		callback(error, model);
	});
};

var get = function (model, callback) {
	var arm = _getArm(model);
	callback(null, arm);
};

var insert = function (model, armId, reward, callback) {
	var arm = _.find(model.arms, function (arm) {
		return '' + arm._id === armId;
	});
	var counts = ++arm.counts;
	var value = ((counts - 1) / counts) * arm.value + reward / counts;

	epsilonGreedyDao.updateArmWithValue(model._id, armId, value, function (error) {
		callback(error);
	});
};

var _getArm = function (model) {
	var arms = model.arms;
	var epsilon = model.settings.epsilon;
	var isExploration = Math.random() < epsilon;

	var arm;
	if (isExploration) {
		arm = _.sample(arms);
	} else {
		arm = _.reduce(arms, function (current, arm) {
			return arm.value > current.value ? arm : current;
		}, {value: Number.NEGATIVE_INFINITY});
	}
	return arm;
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
