var assert = require('assert');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var app = require(path.join(root, 'app', 'insert'));

var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe(__filename, function () {
	describe('main', function () {
		it('should update arm value', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;
				var modelId = id;
				var armId = '' + document.arms[0]._id;
				var reward = 10;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(!error);
					assert.deepEqual(result, {});

					Model.findById(modelId, function (error, document) {
						assert.ok(!error);
						assert.ok(document);

						assert.strictEqual(document.algorithm, 'EpsilonGreedy');
						assert.strictEqual(document.arms[0].name, 'alice');
						assert.strictEqual(document.arms[1].name, 'bob');
						assert.strictEqual(document.arms[0].value, reward);
						assert.strictEqual(document.arms[1].value, 0);
						assert.strictEqual(document.settings.epsilon, 0.5);

						done();
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when modelId is not a string', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = 98248924;
				var armId = '' + document.arms[0]._id;
				var reward = 11;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when modelId is invalid', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = 'lkwje;lfkj;lkj;lkjsdfffffffffffjjjjjjj';
				var armId = '' + document.arms[0]._id;
				var reward = 11;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when armId is not a string', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = '' + document._id;
				var armId = 982424;
				var reward = 11;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when armId is invalid', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = '' + document._id;
				var armId = 'lsdlfklsdfjlkljkjkkkkkkkkkkkkkkllklkjlkjlkjlkjlkjlkj';
				var reward = 11;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when reward is not a number', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				id = '' + document._id;
				var modelId = id;
				var armId = '' + document.arms[0]._id;
				var reward = 'hoge';

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when document is not exists', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = 'abababababababababababab';
				var armId = '' + document.arms[0]._id;
				var reward = 11;

				Model.remove({_id: modelId}, function (error) {
					assert.ok(!error);

					app.main(modelId, armId, reward, function (error, result) {
						assert.ok(error);
						assert.deepEqual(result, {});

						done();
					});
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
		it('should return error when arm is not exists', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{name:'alice'}, {name:'bob'}],
				settings: {
					epsilon: 0.5
				}
			})).save(function (error, document) {
				assert.ok(!error);
				assert.ok(document);

				var modelId = '' + document._id;
				var armId = '999999999bababababababab';
				var reward = 11;

				app.main(modelId, armId, reward, function (error, result) {
					assert.ok(error);
					assert.deepEqual(result, {});

					done();
				});
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
	});
});
