var app = require('../app/get');
var of = new (require('object-formatter'))('@', undefined);

var schema = {
	arm_id: '@_id',
	name: '@name'
};

module.exports = function (req, res) {
	var modelId = req.body.model_id;

	app.main(modelId, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(of.format(schema, result));
	});
};
