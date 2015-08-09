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
			if (!model) return callback(new Error('model not found'), {});

			callback(null, model);
		});
	}
};
