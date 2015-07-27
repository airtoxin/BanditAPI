var app = require('../app/create');
var of = new (require('object-formatter'))('@', null);

var schema = {
	algorithm: '@algorithm',
	model_id: '@_id',
	arms: ['@arms', {
		name: '@name=undefined',
		arm_id: '@_id',
		value: '@value'
	}],
	settings: {
		epsilon: '@settings.epsilon=undefined',
		tau: '@settings.tau=undefined'
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
