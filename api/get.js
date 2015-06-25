var app = require('../app/get');

module.exports = function (req, res) {
	var modelId = req.body.model_id;

	app.main(modelId, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(result);
	});
};
