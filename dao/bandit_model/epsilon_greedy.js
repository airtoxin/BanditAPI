var _ = require('lodash');
var Model = require('../../database')('bandit_model/epsilon_greedy');

var create = function (numArms, epsilon, callback) {
	var arms = _.map(_.range(numArms), function () {return {};});
	(new Model({
		arms: arms,
		settings: {
			epsilon: epsilon
		}
	})).save(function (error, result) {
		if (error) return callback(error, {});
		callback(error, result.toObject());
	});
};

module.exports = {
	create: create
};
