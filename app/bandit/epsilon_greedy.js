var _ = require('lodash');
var async = require('neo-async');

var epsilonGreedyDao = require('../../dao/bandit_model/epsilon_greedy');

var create = function (numArms, settings, callback) {
	var epsilon = settings.epsilon;

	async.waterfall([
		function (next) {
			if (!_.isNumber(epsilon) || _.isNaN(epsilon) || epsilon < 0 || epsilon > 1) return next(new Error('invalid epsilon'));
			next();
		},
		function (next) {
			epsilonGreedyDao.create(numArms, epsilon, function (error, model) {
				next(error, model);
			});
		}
	], function (error, model) {
		var arms = _.map(model.arms, function (arm) {
			return {
				arm_id: arm._id,
				presumption: arm.presumption
			};
		});

		callback(error, {
			algorithm: model.algorithm,
			model_id: model._id,
			arms: arms,
			settings: model.settings
		});
	});
};

var get = function (model, callback) {
	var armId = _getArmId(model);
	callback(null, {
		arm_id: armId
	});
};

var insert = function (model, armId, reward, callback) {
	var N = model.settings.counts;
	var P = _.find(model.arms, function (arm) {
		return '' + arm._id === armId;
	}).presumption;

	var newPresumption = ((N - 1) / N * P) + reward / N;
	epsilonGreedyDao.updateArmWithPresumption(model._id, armId, newPresumption, function (error) {
		callback(error);
	});
};

var _getArmId = function (model) {
	var arms = model.arms;
	var epsilon = model.settings.epsilon;
	var isExploration = Math.random() < epsilon;

	var arm;
	if (isExploration) {
		arm = _.sample(arms);
	} else {
		arm = _.reduce(arms, function (current, arm) {
			return arm.presumption > current.presumption ? arm : current;
		}, {presumption: Number.NEGATIVE_INFINITY});
	}
	return arm._id;
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
