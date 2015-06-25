var app = require('../app/create');

module.exports = function (req, res) {
	var algorithm = req.body.algorithm;
	var numArms = req.body.num_arms;
	var settings = req.body.settings;

	app.main(algorithm, numArms, settings, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(result);
	});
};
