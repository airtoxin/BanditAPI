var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var app = require(path.join(root, 'app', 'get'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('get.js', function () {
	describe('main', function () {
		it('should return arm', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}, {}],
				settings: {
					epsilon: 0.3
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);
				id = '' + document._id;
				var modelId = id;
				var arms = document.arms;

				app.main(modelId, function (error, result) {
					assert.ok(!error);
					assert.ok(result);

					assert.strictEqual(result.value, 0);
					assert.strictEqual(result.counts, 0);
					var isExistArm = false;
					arms.forEach(function (arm) {
						isExistArm = isExistArm || ('' + arm._id === '' + result._id);
					});
					assert.ok(isExistArm);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when id is not a string', function (done) {
			var modelId = 748724;
			app.main(modelId, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when id is invalid', function (done) {
			var modelId = 'oiwjeofijwoeijfoijwoeifjoijwoeifj';
			app.main(modelId, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when model not found', function (done) {
			var modelId = 'abababababababababababab';
			Model.remove({_id: modelId}, function (error) {
				assert.ok(!error);

				app.main(modelId, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});
		});
	});
});
