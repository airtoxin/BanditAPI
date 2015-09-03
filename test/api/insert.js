var path = require('path');
var root = path.join(__dirname, '..', '..');
var assert = require('assert');
var api = require(path.join(root, 'api', 'insert'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe(__filename, function () {
	describe('main', function () {
		it('should update arm value', function (done) {
			var id = null;
			var aliceId = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{
					name: 'alice',
					value: 0
				}, {
					name: 'bob',
					value: 5
				}],
				settings: {
					epsilon: 0
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);
				id = '' + document._id;
				aliceId = '' + document.arms[0]._id;

				var req = {
					body: {
						model_id: id,
						arm_id: aliceId,
						reward: 100
					}
				};
				var res = {
					status: function (status) {
						assert.strictEqual(status, 200);
						return this;
					},
					json: function (result) {
						assert.deepEqual(result, {});

						Model.findById(id, function (error, document) {
							assert.ok(!error);
							assert.ok(document);
							document.arms.forEach(function (arm) {
								if (arm.name === 'alice') {
									assert.strictEqual(arm.value, 100);
								} else {
									assert.strictEqual(arm.value, 5);
								}
							});

							done();
						});
					}
				};

				api(req, res);
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
	});
});
