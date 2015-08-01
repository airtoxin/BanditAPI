var path = require('path');
var root = path.join(__dirname, '..', '..');
var assert = require('assert');
var async = require('neo-async');
var api = require(path.join(root, 'api', 'delete'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('delete.js', function () {
	describe('main', function () {
		it('should delete exact model', function (done) {
			var modelId = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}, {}],
				settings: {epsilon: 0.5}
			})).save(function (error, result) {
				assert.ok(!error)
				assert.ok(result);
				modelId = '' + result._id;


				var req = {body:{model_id: modelId}};
				var res = {
					status: function (status) {
						assert.strictEqual(status, 200);
						return this;
					},
					json: function (result) {
						assert.deepEqual(result, {});

						Model.findById(modelId, function (error, result) {
							assert.ok(!error);
							assert.ok(!result);
							done();
						});
					}
				};

				api(req, res);
			});

			after(function (done) {
				Model.remove({_id: modelId}, done);
			});
		});
	});
});
