var _ = require('lodash');
var async = require('neo-async');
var requireDir = require('require-dir');

var banditModelDao = require('../dao/bandit_model');
var Bandit = requireDir('./bandit');

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
			},
			function (model, next) {
				try {
					var algorithm = _.snakeCase(model.algorithm);
					var bandit = Bandit[algorithm];
					bandit.get(model, function (error, result) {
						next(error, result);
					});
				} catch (e) {
					next(e);
				}
			}
		], function (error, result) {
			if (error) return callback(error, {});
			callback(null, result);
		});
	}
};
