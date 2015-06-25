var app = require('../app/insert');

module.exports = function (req, res) {
	var modelId = req.body.model_id;
	var armId = req.body.arm_id;
	var reward = req.body.reward;

	app.main(modelId, armId, reward, function (error, result) {
		var status = error ? 400 : 200;

		res.status(status).json(result);
	});
};
