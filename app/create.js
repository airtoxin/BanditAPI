var _ = require('lodash');
var async = require('neo-async');
var requireDir = require('require-dir');

var Bandit = requireDir('./bandit');

module.exports = {
	main: function (algorithm, numArms, settings, callback) {
		async.waterfall([
			function (next) {
				if (!_.isString(algorithm)) return next(new Error('invalid algorithm'));
				if (!_.isNumber(numArms) || _.isNaN(numArms) || numArms < 1) return next(new Error('invalid numArms'));
				if (numArms > 100) return next(new Error('too many numArms'));
				if (!_.isObject(settings)) return next(new Error('invalid settings'));
				next();
			},
			function (next) {
				try {
					var bandit = Bandit[algorithm];
					bandit.create(numArms, settings, function (error, result) {
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
