var app = require('../app/status');

module.exports = function (req, res) {
	var modelId = req.body.model_id;

	app.main(modelId, function (error, result) {
		var status = error ? error.status : 200;

		res.status(status).json(result);
	});
};
