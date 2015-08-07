var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var app = require(path.join(root, 'app', 'delete'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('delete.js', function () {
	describe('main', function () {
		it('should delete exact document', function (done) {
			var id = null;

			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}, {}],
				settings: {
					epsilon: 0.4
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;

				app.main(id, function (error, result) {
					assert.ok(!error);
					assert.deepEqual(result, {});

					Model.findById(id, function (error, document) {
						assert.ok(!error);
						assert.ok(!document);

						done();
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when modelId is not a string', function (done) {
			var id = 804;

			app.main(id, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
		it('should return error when modelId is invalid', function (done) {
			var id = 'ojwjeofijwoeiijjjjjjjjjjjjjjjjjjj';

			app.main(id, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
	});
});
