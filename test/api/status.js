var path = require('path');
var root = path.join(__dirname, '..', '..');
var assert = require('assert');
var api = require(path.join(root, 'api', 'status'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe(__filename, function () {
	describe('main', function () {
		it('should return model', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{
					name: 'alice',
					value: 1000
				}, {
					name: 'bob',
					value: 0
				}],
				settings: {
					epsilon: 0.3
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);
				id = '' + document._id;

				var req = {
					body: {
						model_id: id
					}
				};
				var res = {
					status: function (status) {
						assert.strictEqual(status, 200);
						return this;
					},
					json: function (result) {
						assert.strictEqual(result.algorithm, 'EpsilonGreedy');
						assert.strictEqual(result.arms.length, 2);
						assert.ok(result.arms[0].arm_id);
						assert.ok(result.arms[1].arm_id);
						assert.strictEqual(result.arms[0].name, 'alice');
						assert.strictEqual(result.arms[1].name, 'bob');
						assert.strictEqual(result.arms[0].value, 1000);
						assert.strictEqual(result.arms[1].value, 0);
						assert.strictEqual(result.settings.epsilon, 0.3);
						done();
					}
				};

				api(req, res);
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return empty object when mode_id is missing', function (done) {
			var req = {
				body: {}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.deepEqual(result, {
						model_id: undefined,
						algorithm: undefined,
						arms: undefined,
						settings: {
							epsilon: undefined,
							tau: undefined
						}
					});
					done();
				}
			};

			api(req, res);
		});
	});
});
