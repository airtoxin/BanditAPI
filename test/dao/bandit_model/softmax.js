var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..', '..');
var dao = require(path.join(root, 'dao', 'bandit_model', 'softmax'));
var Model = require(path.join(root, 'database'))('bandit_model/softmax');

describe('softmax.js', function () {
	describe('interface', function () {
		it('should have functions', function (done) {
			assert.strictEqual(Object.keys(dao).length, 3);

			assert.strictEqual(typeof dao.createByArmNames, 'function');
			assert.strictEqual(typeof dao.createByNumArms, 'function');
			assert.strictEqual(typeof dao.updateArmWithValue, 'function');
			done();
		});
	});

	describe('createByArmNames', function () {
		it('should create document', function (done) {
			var id = null;
			var armNames = ['alice', 'bob'];
			var tau = 0.5;
			dao.createByArmNames(armNames, tau, function (error, result) {
				assert.ok(!error);
				assert.ok(result);

				id = '' + result._id;
				assert.strictEqual(result.algorithm, 'Softmax');
				assert.strictEqual(result.arms.length, 2);
				assert.strictEqual(result.arms[0].name, 'alice');
				assert.strictEqual(result.arms[1].name, 'bob');
				assert.strictEqual(result.settings.tau, tau);

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'Softmax');
					assert.strictEqual(document.arms.length, 2);
					assert.strictEqual(document.arms[0].name, 'alice');
					assert.strictEqual(document.arms[1].name, 'bob');
					assert.strictEqual(document.settings.tau, tau);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when tau is undefined', function (done) {
			var armNames = ['alice', 'bob'];
			var tau = undefined;
			dao.createByArmNames(armNames, tau, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
	});

	describe('createByNumArms', function () {
		it('should create document', function (done) {
			var id = null;
			var numArms = 5;
			var tau = 0.5;
			dao.createByNumArms(numArms, tau, function (error, result) {
				assert.ok(!error);
				assert.ok(result);
				id = '' + result._id;

				assert.strictEqual(result.algorithm, 'Softmax');
				assert.strictEqual(result.arms.length, 5);
				assert.strictEqual(result.settings.tau, tau);

				Model.findById(id, function (error, document) {
					assert.ok(!error);
					assert.ok(document);

					assert.strictEqual(document.algorithm, 'Softmax');
					assert.strictEqual(document.arms.length, 5);
					assert.strictEqual(document.settings.tau, tau);

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when tau is undefined', function (done) {
			var numArms = 10;
			var tau = undefined;
			dao.createByNumArms(numArms, tau, function (error, result) {
				assert.ok(error);
				assert.deepEqual(result, {});

				done();
			});
		});
	});

	describe('updateArmWithValue', function () {
		it('should update document fields and arm fields', function (done) {
			var id = null;
			(new Model({
				algorithm: 'Softmax',
				arms: [{name: 'alice'}, {name: 'bob'}],
				settings: {
					tau: 0.2
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);
				id = '' + document._id;

				var modelId = id;
				var armId = '' + document.arms[0]._id;
				var value = 50;
				dao.updateArmWithValue(modelId, armId, value, function (error) {
					assert.ok(!error);

					Model.findById(id, function (error, document) {
						assert.ok(!error);
						assert.ok(document);
						assert.strictEqual(document.arms[0].name, 'alice');
						assert.strictEqual(document.arms[1].name, 'bob');
						assert.strictEqual(document.arms[0].value, 50);
						assert.strictEqual(document.arms[1].value, 0);
						assert.strictEqual(document.arms[0].counts, 1);
						assert.strictEqual(document.arms[1].counts, 0);
						assert.strictEqual(document.settings.tau, 0.2);
						assert.strictEqual(document.settings.total_counts, 1);

						done();
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
	});
});
