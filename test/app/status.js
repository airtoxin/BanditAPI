var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var app = require(path.join(root, 'app', 'status'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe(__filename, function () {
	describe('main', function () {
		it('should return exact model data', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.3
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;
				var modelId = id;

				app.main(modelId, function (error, result) {
					assert.ok(!error);
					assert.ok(result);

					assert.strictEqual('' + result._id, modelId);
					assert.strictEqual(result.algorithm, 'EpsilonGreedy');
					assert.strictEqual(result.arms.length, 2);
					assert.strictEqual(result.arms[0].name, 'alice');
					assert.strictEqual(result.arms[1].name, 'bob');
					assert.strictEqual(result.arms[0].value, 0);
					assert.strictEqual(result.arms[1].value, 0);
					assert.strictEqual(result.settings.epsilon, 0.3);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when modelId is not a string', function (done) {
			var modelId = 982424;
			app.main(modelId, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when modelId is invalid', function (done) {
			var modelId = 'lkasjdlfkjl;akjewl;kejw;lkejfw;lkejfw;lekfj';
			app.main(modelId, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when document is not found', function (done) {
			var modelId = 'aabbaabbaabbaabbaabbaabb';
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
