var app = require('../app/status');
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
	var modelId = req.body.model_id;

	app.main(modelId, function (error, result) {
		var status = error ? error.status : 200;

		res.status(status).json(of.format(schema, result));
	});
};
