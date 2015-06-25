var _ = require('lodash');
var async = require('neo-async');

var banditModelDao = require('../dao/bandit_model');

module.exports = {
	main: function (modelId, callback) {
		async.waterfall([
			function (next) {
				if (!_.isString(modelId) || modelId.length !== 24) return next(new Error('invalid model_id'));
				next();
			},
			function (next) {
				banditModelDao.findById(modelId, function (error, model) {
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
			callback(null, {
				model_id: model._id,
				algorithm: model.algorithm,
				created: model.created,
				last_updated: model.updated,
				update_counts: model.count,
				arms: arms,
				settings: model.settings
			});
		});
	}
};
