var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var dao = require(path.join(root, 'dao', 'bandit_model'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('bandit_model.js', function () {
	describe('interface', function () {
		it('should have functions', function (done) {
			assert.strictEqual(Object.keys(dao).length, 2);

			assert.strictEqual(typeof dao.findById, 'function');
			assert.strictEqual(typeof dao.remove, 'function');
			done();
		});
	});

	describe('findById', function () {
		it('should return exact document', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}, {}, {}],
				settings: {
					epsilon: 0.75
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);
				id = '' + document._id;

				dao.findById(id, function (error, result) {
					assert.ok(!error);
					assert.ok(result);

					assert.strictEqual('' + result._id, id);
					assert.strictEqual(result.arms.length, 3);
					assert.strictEqual(result.settings.epsilon, 0.75);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when id is invalid', function (done) {
			var id = 'lkjwelfjwlejflwejlwkjeflwejflkjflkjw;lejf;lkj';
			dao.findById(id, function (error, result) {
				assert.ok(error);
				assert.ok(!result);
				done();
			});
		});
		it('should return null when document not found', function (done) {
			var id = 'aa11aa11aa11aa11aa11aa11';
			dao.findById(id, function (error, result) {
				assert.ok(!error);
				assert.strictEqual(result, null);
				done();
			});
		});
	});

	describe('remove', function () {
		it('should delete exact document', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{}, {}, {}],
				settings: {
					epsilon: 0.75
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;

				dao.remove(id, function (error) {
					assert.ok(!error);

					Model.findById(id, function (error, result) {
						assert.ok(!error);
						assert.strictEqual(result, null);

						done();
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when id is invalid', function (done) {
			var id = 'lwljeowejowijfowiejowifweefwefwefewfwefwef';
			dao.remove(id, function (error) {
				assert.ok(error);
				done();
			});
		});
		it('should do nothing, when document not found', function (done) {
			var id = 'a1a1a1a1a1a1a1a1a1a1a1a1';
			dao.remove(id, function (error) {
				assert.ok(!error);
				done();
			});
		});
	});
});
