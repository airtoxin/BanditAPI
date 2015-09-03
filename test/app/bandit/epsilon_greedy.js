var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..', '..');
var bandit = require(path.join(root, 'app', 'bandit', 'epsilon_greedy'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('epsilon_greedy.js', function () {
	describe('create', function () {
		it('should create exact document by armNames', function (done) {
			var id = null;
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: 0.5
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				assert.strictEqual(result.algorithm, 'EpsilonGreedy');
				assert.strictEqual(result.arms.length, 2);
				assert.strictEqual(result.arms[0].name, 'alice');
				assert.strictEqual(result.arms[1].name, 'bob');
				assert.strictEqual(result.arms[0].value, 0);
				assert.strictEqual(result.arms[1].value, 0);
				assert.strictEqual(result.settings.epsilon, 0.5);

				id = '' + result._id;

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'EpsilonGreedy');
					assert.strictEqual(document.arms.length, 2);
					assert.strictEqual(document.arms[0].name, 'alice');
					assert.strictEqual(document.arms[1].name, 'bob');
					assert.strictEqual(document.arms[0].value, 0);
					assert.strictEqual(document.arms[1].value, 0);
					assert.strictEqual(document.settings.epsilon, 0.5);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should create exact document by numArms', function (done) {
			var id = null;
			var armNames;
			var numArms = 5;
			var settings = {
				epsilon: 0.5
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				assert.strictEqual(result.algorithm, 'EpsilonGreedy');
				assert.strictEqual(result.arms.length, 5);
				assert.strictEqual(result.arms[0].value, 0);
				assert.strictEqual(result.arms[1].value, 0);
				assert.strictEqual(result.arms[2].value, 0);
				assert.strictEqual(result.arms[3].value, 0);
				assert.strictEqual(result.arms[4].value, 0);
				assert.strictEqual(result.settings.epsilon, 0.5);

				id = '' + result._id;

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'EpsilonGreedy');
					assert.strictEqual(document.arms.length, 5);
					assert.strictEqual(document.arms[0].value, 0);
					assert.strictEqual(document.arms[1].value, 0);
					assert.strictEqual(document.arms[2].value, 0);
					assert.strictEqual(document.arms[3].value, 0);
					assert.strictEqual(document.arms[4].value, 0);
					assert.strictEqual(document.settings.epsilon, 0.5);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should have high priority to armNames than numArms', function (done) {
			var id = null;
			var armNames = ['alice'];
			var numArms = 5;
			var settings = {
				epsilon: 0.5
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				assert.strictEqual(result.algorithm, 'EpsilonGreedy');
				assert.strictEqual(result.arms.length, 1);
				assert.strictEqual(result.arms[0].name, 'alice');
				assert.strictEqual(result.arms[0].value, 0);
				assert.strictEqual(result.settings.epsilon, 0.5);

				id = '' + result._id;

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'EpsilonGreedy');
					assert.strictEqual(document.arms.length, 1);
					assert.strictEqual(document.arms[0].name, 'alice');
					assert.strictEqual(document.arms[0].value, 0);
					assert.strictEqual(document.settings.epsilon, 0.5);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when epsilon is not a number', function (done) {
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: '0.5'
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when epsilon is NaN', function (done) {
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: NaN
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when epsilon is negative', function (done) {
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: -0.0005
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when epsilon is bigger than 1', function (done) {
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: 1.1
			};

			bandit.create(armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
	});

	describe('get', function () {
		it('should return arm', function (done) {
			var model = {
				arms: [{name: 'alice', value: 1}],
				settings: {
					epsilon: 0.5
				}
			};

			bandit.get(model, function (error, result) {
				assert.ok(!error);
				assert.deepEqual(result, model.arms[0]);

				done();
			});
		});
		it('should draw 100% alice when epsilon is 0', function (done) {
			this.timeout(10000);
			var model = {
				arms: [{
					name: 'alice', value: 1
				}, {
					name: 'bob', value: 0
				}],
				settings: {
					epsilon: 0
				}
			};

			var totalCount = 1000000;
			var drawCountAlice = 0;
			var checkDraw = function (error, result) {
				if (result.name === 'alice') drawCountAlice++;
			};
			for (var i = 0; i < totalCount; i++) {
				bandit.get(model, checkDraw);
			}

			//100%-alice, 0%-bob
			assert.strictEqual(drawCountAlice, totalCount);

			done();
		});
		it('should draw 50% alice, 50% bob when epsilon is 1', function (done) {
			this.timeout(10000);
			var model = {
				arms: [{
					name: 'alice', value: 1
				}, {
					name: 'bob', value: 0
				}],
				settings: {
					epsilon: 1
				}
			};

			var totalCount = 1000000;
			var drawCountAlice = 0;
			var checkDraw = function (error, result) {
				if (result.name === 'alice') drawCountAlice++;
			};
			for (var i = 0; i < totalCount; i++) {
				bandit.get(model, checkDraw);
			}

			//near 50%-alice, 50%-bob
			assert.ok(drawCountAlice / totalCount > 0.49);
			assert.ok(drawCountAlice / totalCount < 0.51);

			done();
		});
		it('should do probabilistically based draw', function (done) {
			this.timeout(10000);
			var model = {
				arms: [{
					name: 'alice', value: 1
				}, {
					name: 'bob', value: 0
				}],
				settings: {
					epsilon: 0.5
				}
			};

			var totalCount = 1000000;
			var drawCountAlice = 0;
			var checkDraw = function (error, result) {
				if (result.name === 'alice') drawCountAlice++;
			};
			for (var i = 0; i < totalCount; i++) {
				bandit.get(model, checkDraw);
			}

			//near 75%-alice, 25%-bob
			assert.ok(drawCountAlice / totalCount > 0.74);
			assert.ok(drawCountAlice / totalCount < 0.76);

			done();
		});
	});

	describe('insert', function () {
		it('should update arm value', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;
				var model = document;
				var armId = '' + document.arms[0]._id;

				bandit.insert(model, armId, 10, function (error) {
					assert.ok(!error);

					Model.findById(id, function (error, document) {
						assert.ok(!error);
						assert.ok(document);

						assert.strictEqual(document.algorithm, 'EpsilonGreedy');
						assert.strictEqual(document.arms.length, 1);
						assert.strictEqual(document.arms[0].value, 10);
						assert.strictEqual(document.arms[0].counts, 1);
						assert.strictEqual(document.settings.epsilon, 0.5);

						Model.findById(id, function (error, document) {
							assert.ok(!error);
							assert.ok(document);

							model = document;
							armId = '' + document.arms[0]._id;
							bandit.insert(model, armId, 0, function (error) {
								assert.ok(!error);

								Model.findById(id, function (error, document) {
									assert.ok(!error);
									assert.ok(document);

									assert.strictEqual(document.algorithm, 'EpsilonGreedy');
									assert.strictEqual(document.arms.length, 1);
									assert.strictEqual(document.arms[0].value, 5);
									assert.strictEqual(document.arms[0].counts, 2);
									assert.strictEqual(document.settings.epsilon, 0.5);
								});
							});

							done();
						});
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
	});
});
