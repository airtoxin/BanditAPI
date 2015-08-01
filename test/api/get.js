var path = require('path');
var root = path.join(__dirname, '..', '..');
var assert = require('assert');
var api = require(path.join(root, 'api', 'get'));
var Model = require(path.join(root, 'database'))('bandit_model/epsilon_greedy');

describe('get.js', function () {
	describe('main', function () {
		it('should return best arm when epsilon is min', function (done) {
			var id = null;
			(new Model({
				algorithm: 'EpsilonGreedy',
				arms: [{
					name: 'alice',
					value: 1000
				}, {
					name: 'bob',
					value: 0
				}, {
					name: 'a',
					value: 1
				}, {
					name: 'b',
					value: 2
				}, {
					name: 'c',
					value: 3
				}, {
					name: 'd',
					value: 4
				}, {
					name: 'e',
					value: 5
				}, {
					name: 'f',
					value: 6
				}, {
					name: 'g',
					value: 7
				}, {
					name: 'h',
					value: 8
				}, {
					name: 'i',
					value: 9
				}, {
					name: 'j',
					value: 10
				}, {
					name: 'k',
					value: 100
				}],
				settings: {
					epsilon: 0
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
						assert.strictEqual(result.name, 'alice');
						done();
					}
				};

				api(req, res);
			});

			after(function (done) {
				Model.remove({_id: id}, done);
			});
		});
	});
});
