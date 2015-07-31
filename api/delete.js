var app = require('../app/delete');
var of = new (require('object-formatter'))('@', undefined);

var schema = {};

module.exports = function (req, res) {
	var modelId = req.body.model_id;

	app.main(modelId, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(of.format(schema, result));
	});
};
