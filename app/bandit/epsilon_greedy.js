var _ = require('lodash');
var async = require('neo-async');

var epsilonGreedyDao = require('../../dao/bandit_model/epsilon_greedy');

module.exports = {
	create: function (numArms, settings, callback) {
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
	}
};
