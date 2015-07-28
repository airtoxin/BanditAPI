var _ = require('lodash');
var async = require('neo-async');

var ucb1Dao = require('../../dao/bandit_model/ucb_1');

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
	var arm = _getArm(model);
	callback(null, arm);
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

var _getArm = function (model) {
	// there are any non-initialized arms?
	var initialArm = _.find(model.arms, function (arm) {
		return arm.counts === 0;
	});
	if (initialArm) return initialArm;

	var totalCounts = model.settings.total_counts;
	var arm = _.reduce(model.arms, function (best, arm) {
		var bonus = Math.sqrt((2 * Math.log(totalCounts)) / arm.counts);
		var ucbValue = arm.value + bonus;
		return best.ucbValue > ucbValue ?
			best : {arm: arm, ucbValue: ucbValue};
	}, {arm:{}, ucbValue: Math.NEGATIVE_INFINITY}).arm;
	return arm;
};

module.exports = {
	create: create,
	get: get,
	insert: insert
};
