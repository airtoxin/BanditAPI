var _ = require('lodash');
var async = require('neo-async');
var requireDir = require('require-dir');

var Bandit = requireDir('./bandit');

module.exports = {
	main: function (algorithm, armNames, numArms, settings, callback) {
		async.waterfall([
			function (next) {
				if (!_.isString(algorithm)) return next(new Error('invalid algorithm'));
				// armNames or numArms required
				if (armNames) {
					if (!_.isArray(armNames) || !_.every(armNames, _.isString)) return next(new Error('invalid armNames'));
				} else if (numArms) {
					if (!_.isNumber(numArms) || _.isNaN(numArms) || numArms < 1) return next(new Error('invalid numArms'));
					if (numArms > 100) return next(new Error('too many numArms'));
				} else {
					return next(new Error('few args'));
				}
				if (!_.isObject(settings)) return next(new Error('invalid settings'));
				next();
			},
			function (next) {
				try {
					var bandit = Bandit[algorithm];
					bandit.create(armNames, numArms, settings, function (error, result) {
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
