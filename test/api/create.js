var path = require('path');
var root = path.join(__dirname, '..', '..');
var assert = require('assert');
var api = require(path.join(root, 'api', 'create'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('create.js', function () {
	describe('epsilon_greedy', function () {
		it('should create epsilon greedy model with arm_names', function (done) {
			var modelId = null;
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					arm_names: ['alice', 'bob'],
					settings: {
						epsilon: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 200);
					return this;
				},
				json: function (result) {
					modelId = result.model_id;
					assert.strictEqual(result.algorithm, 'EpsilonGreedy');
					assert.strictEqual(result.arms.length, 2);
					assert.strictEqual(result.arms[0].name, 'alice');
					assert.strictEqual(result.arms[1].name, 'bob');
					assert.strictEqual(result.settings.epsilon, 0.5);
					Model.findById(modelId, function (error, result) {
						assert.ok(!error);
						assert.strictEqual('' + result._id, '' + modelId);
						assert.strictEqual(result.algorithm, 'EpsilonGreedy');
						assert.strictEqual(result.arms.length, 2);
						assert.strictEqual(result.arms[0].name, 'alice');
						assert.strictEqual(result.arms[1].name, 'bob');
						assert.strictEqual(result.settings.epsilon, 0.5);
						done();
					});
				}
			};

			api(req, res);

			after(function (done) {
				Model.remove({_id: modelId}, done);
			});
		});

		it('should create epsilon greedy model with num_arms', function (done) {
			var modelId = null;
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					num_arms: 5,
					settings: {
						epsilon: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 200);
					return this;
				},
				json: function (result) {
					modelId = result.model_id;
					assert.strictEqual(result.algorithm, 'EpsilonGreedy');
					assert.strictEqual(result.arms.length, 5);
					assert.strictEqual(result.settings.epsilon, 0.5);
					Model.findById(modelId, function (error, result) {
						assert.ok(!error);
						assert.strictEqual('' + result._id, '' + modelId);
						assert.strictEqual(result.algorithm, 'EpsilonGreedy');
						assert.strictEqual(result.arms.length, 5);
						assert.strictEqual(result.settings.epsilon, 0.5);
						done();
					});
				}
			};

			api(req, res);

			after(function (done) {
				Model.remove({_id: modelId}, done);
			});
		});

		it('should return error when algorithm is invalid', function (done) {
			var req = {
				body: {
					algorithm: 'aaaaaaaaaa',
					arm_names: ['alice', 'bob'],
					settings: {
						epsilon: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.epsilon, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when arm data is empty', function (done) {
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					settings: {
						epsilon: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.epsilon, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when num_arms is too big', function (done) {
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					num_arms: 10182988924,
					settings: {
						epsilon: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.epsilon, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when epsilon is too big', function (done) {
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					num_arms: 5,
					settings: {
						epsilon: 2
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.epsilon, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when epsilon is negative', function (done) {
			var req = {
				body: {
					algorithm: 'epsilon_greedy',
					num_arms: 5,
					settings: {
						epsilon: -0.3
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.epsilon, undefined);
					done();
				}
			};

			api(req, res);
		});
	});

	describe('softmax', function () {
		it('should create softmax model with arm_names', function (done) {
			var modelId = null;
			var req = {
				body: {
					algorithm: 'softmax',
					arm_names: ['alice', 'bob'],
					settings: {
						tau: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 200);
					return this;
				},
				json: function (result) {
					modelId = result.model_id;
					assert.strictEqual(result.algorithm, 'Softmax');
					assert.strictEqual(result.arms.length, 2);
					assert.strictEqual(result.arms[0].name, 'alice');
					assert.strictEqual(result.arms[1].name, 'bob');
					assert.strictEqual(result.settings.tau, 0.5);
					Model.findById(modelId, function (error, result) {
						assert.ok(!error);
						assert.strictEqual('' + result._id, '' + modelId);
						assert.strictEqual(result.algorithm, 'Softmax');
						assert.strictEqual(result.arms.length, 2);
						assert.strictEqual(result.arms[0].name, 'alice');
						assert.strictEqual(result.arms[1].name, 'bob');
						assert.strictEqual(result.settings.tau, 0.5);
						done();
					});
				}
			};

			api(req, res);

			after(function (done) {
				Model.remove({_id: modelId}, done);
			});
		});

		it('should create softmax model with num_arms', function (done) {
			var modelId = null;
			var req = {
				body: {
					algorithm: 'softmax',
					num_arms: 5,
					settings: {
						tau: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 200);
					return this;
				},
				json: function (result) {
					modelId = result.model_id;
					assert.strictEqual(result.algorithm, 'Softmax');
					assert.strictEqual(result.arms.length, 5);
					assert.strictEqual(result.settings.tau, 0.5);
					Model.findById(modelId, function (error, result) {
						assert.ok(!error);
						assert.strictEqual('' + result._id, '' + modelId);
						assert.strictEqual(result.algorithm, 'Softmax');
						assert.strictEqual(result.arms.length, 5);
						assert.strictEqual(result.settings.tau, 0.5);
						done();
					});
				}
			};

			api(req, res);

			after(function (done) {
				Model.remove({_id: modelId}, done);
			});
		});

		it('should return error when algorithm is invalid', function (done) {
			var req = {
				body: {
					algorithm: 'aaaaaaaaaa',
					arm_names: ['alice', 'bob'],
					settings: {
						tau: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.tau, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when arm data is empty', function (done) {
			var req = {
				body: {
					algorithm: 'softmax',
					settings: {
						tau: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.tau, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when num_arms is too big', function (done) {
			var req = {
				body: {
					algorithm: 'softmax',
					num_arms: 10182988924,
					settings: {
						tau: 0.5
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.tau, undefined);
					done();
				}
			};

			api(req, res);
		});

		it('should return error when tau is negative', function (done) {
			var req = {
				body: {
					algorithm: 'softmax',
					num_arms: 5,
					settings: {
						tau: -0.3
					}
				}
			};
			var res = {
				status: function (status) {
					assert.strictEqual(status, 400);
					return this;
				},
				json: function (result) {
					assert.strictEqual(result.algorithm, undefined);
					assert.strictEqual(result.model_id, undefined);
					assert.strictEqual(result.arms, undefined);
					assert.strictEqual(result.settings.tau, undefined);
					done();
				}
			};

			api(req, res);
		});
	});
});
