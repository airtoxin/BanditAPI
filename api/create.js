var app = require('../app/create');
var of = new (require('object-formatter'))('@', undefined);

var schema = {
	algorithm: '@algorithm',
	model_id: '@_id',
	arms: ['@arms', {
		name: '@name',
		arm_id: '@_id',
		value: '@value'
	}],
	settings: {
		epsilon: '@settings.epsilon',
		tau: '@settings.tau'
	}
};

module.exports = function (req, res) {
	var algorithm = req.body.algorithm;
	var armNames = req.body.arm_names;
	var numArms = req.body.num_arms;
	var settings = req.body.settings;

	app.main(algorithm, armNames, numArms, settings, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(of.format(schema, result));
	});
};
