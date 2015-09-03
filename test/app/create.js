var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var app = require(path.join(root, 'app', 'create'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe(__filename, function () {
	describe('main', function () {
		it('should create exact model with armNames', function (done) {
			var id = null;
			var algorithm = 'epsilon_greedy';
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				id = '' + result._id;
				assert.strictEqual(result.algorithm, 'EpsilonGreedy');
				assert.strictEqual(result.arms.length, 2);
				assert.strictEqual(result.arms[0].name, 'alice');
				assert.strictEqual(result.arms[1].name, 'bob');
				assert.strictEqual(result.arms[0].value, 0);
				assert.strictEqual(result.arms[1].value, 0);
				assert.strictEqual(result.settings.epsilon, 0.4);

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'EpsilonGreedy');
					assert.strictEqual(document.arms.length, 2);
					assert.strictEqual(document.arms[0].name, 'alice');
					assert.strictEqual(document.arms[1].name, 'bob');
					assert.strictEqual(document.arms[0].value, 0);
					assert.strictEqual(document.arms[1].value, 0);
					assert.strictEqual(document.settings.epsilon, 0.4);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should create exact model with numArms', function (done) {
			var id = null;
			var algorithm = 'epsilon_greedy';
			var armNames;
			var numArms = 13;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				id = '' + result._id;
				assert.strictEqual(result.algorithm, 'EpsilonGreedy');
				assert.strictEqual(result.arms.length, 13);
				result.arms.forEach(function (arm) {
					assert.strictEqual(arm.value, 0);
				});
				assert.strictEqual(result.settings.epsilon, 0.4);

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'EpsilonGreedy');
					assert.strictEqual(document.arms.length, 13);
					document.arms.forEach(function (arm) {
						assert.strictEqual(arm.value, 0);
					});
					assert.strictEqual(document.settings.epsilon, 0.4);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when algorithm is not a string', function (done) {
			var algorithm = 99;
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when algorithm is invalid', function (done) {
			var algorithm = 'hoge';
			var armNames = ['alice', 'bob'];
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when armNames is not an array', function (done) {
			var algorithm = 'hoge';
			var armNames = 'fuga';
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when armNames element is not a string', function (done) {
			var algorithm = 'hoge';
			var armNames = ['fuga', 1];
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when numArms is NaN', function (done) {
			var algorithm = 'hoge';
			var armNames;
			var numArms = NaN;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when numArms is too big', function (done) {
			var algorithm = 'hoge';
			var armNames;
			var numArms = 2894982998399831938247000000981713;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when numArms is too small', function (done) {
			var algorithm = 'hoge';
			var armNames;
			var numArms = -1;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when both of armNames and numArms is undefined', function (done) {
			var algorithm = 'hoge';
			var armNames;
			var numArms;
			var settings = {
				epsilon: 0.4
			};

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when settings is undefined', function (done) {
			var algorithm = 'hoge';
			var armNames;
			var numArms = 5;
			var settings;

			app.main(algorithm, armNames, numArms, settings, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
	});
});
