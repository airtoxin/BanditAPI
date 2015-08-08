var _ = require('lodash');
var async = require('neo-async');
var requireDir = require('require-dir');

var banditModelDao = require('../dao/bandit_model');
var Bandit = requireDir('./bandit');

module.exports = {
	main: function (modelId, armId, reward, callback) {
		async.waterfall([
			function (next) {
				if (!_.isString(modelId) || modelId.length !== 24) return next(new Error('invalid model_id'));
				if (!_.isString(armId) || modelId.length !== 24) return next(new Error('invalid arm_id'));
				if (!_.isNumber(reward)) return next(new Error('invalid reward'));
				next();
			},
			function (next) {
				banditModelDao.findById(modelId, function (error, model) {
					next(error, model);
				});
			},
			function (model, next) {
				if (!model) return next(new Error('model not found'));
				// algorithm specified validations
				if (model.algorithm === 'Ucb1') {
					if (reward < 0 || 1 < reward) return next(new Error('invalid reward'));
				}
				next(null, model);
			},
			function (model, next) {
				try {
					var algorithm = _.snakeCase(model.algorithm);
					var bandit = Bandit[algorithm];
					bandit.insert(model, armId, reward, function (error) {
						next(error);
					});
				} catch (e) {
					next(e);
				}
			}
		], function (error) {
			if (error) return callback(error, {});

			callback(null, {});
		});
	}
};
