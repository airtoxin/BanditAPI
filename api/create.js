var app = require('../app/create');
var of = new (require('object-formatter'))('@', null);

var schema = {
	algorithm: '@algorithm',
	model_id: '@_id',
	arms: ['@arms', {
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
	var numArms = req.body.num_arms;
	var settings = req.body.settings;

	app.main(algorithm, numArms, settings, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(of.format(schema, result));
	});
};
