var _ = require('lodash');
var async = require('neo-async');

var softmaxDao = require('../../dao/bandit_model/softmax');

var create = function (numArms, settings, callback) {
	var tau = settings.tau;

	async.waterfall([
		function (next) {
			if (!_.isNumber(tau) || _.isNaN(tau) || tau < 0) return next(new Error('invalid tau'));
			next();
		},
		function (next) {
			softmaxDao.create(numArms, tau, function (error, model) {
				next(error, model);
			});
		}
	], function (error, model) {
		if (error) return callback(error, {});

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
	var tau = model.settings.tau;
	var z = _.reduce(model.arms, function (total, arm) {
		return total + Math.exp(arm.value / tau);
	}, 0);
	var arm = _.reduce(model.arms, function (best, arm) {
		var prob = Math.exp(arm.value / tau) / z;
		return best.prob > prob ?
			best : {arm: arm, prob: prob};
	}, {arm:{}, prob: Math.NEGATIVE_INFINITY}).arm;

	callback(null, {
		arm_id: arm._id
	});
};

var insert = function (model, armId, reward, callback) {
	var arm = _.find(model.arms, function (arm) {
		return '' + arm._id === armId;
	});
	var counts = ++arm.counts;
	var value = (counts - 1) / counts * arm.value + reward / counts;

	softmaxDao.updateArmWithValue(model._id, armId, value, function (error) {
		callback(error);
	});
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
