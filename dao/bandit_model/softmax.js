var _ = require('lodash');
var Model = require('../../database')('bandit_model/softmax');

var createByArmNames = function (armNames, tau, callback) {
	var arms = _.map(armNames, function (armName) {
		return {
			name: armName
		};
	});
	(new Model({
		arms: arms,
		settings: {
			tau: tau
		}
	})).save(function (error, result) {
		if (error) return callback(error, {});
		callback(error, result.toObject());
	});
};

var createByNumArms = function (numArms, tau, callback) {
	var arms = _.map(_.range(numArms), function () {return {};});
	(new Model({
		arms: arms,
		settings: {
			tau: tau
		}
	})).save(function (error, result) {
		if (error) return callback(error, {});
		callback(error, result.toObject());
	});
};

var updateArmWithValue = function (modelId, armId, value, callback) {
	Model.update({
		_id: modelId,
		'arms._id': armId
	}, {
		$inc: {
			'arms.$.counts': 1,
			'settings.total_counts': 1
		},
		$set: {'arms.$.value': value}
	}, function (error) {
		callback(error);
	});
};

module.exports = {
	createByArmNames: createByArmNames,
	createByNumArms: createByNumArms,
	updateArmWithValue: updateArmWithValue
};
