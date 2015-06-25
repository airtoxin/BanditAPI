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
				banditModelDao.remove(modelId, function (error) {
					next(error);
				});
			}
		], function (error) {
			callback(error, {});
		});
	}
};
