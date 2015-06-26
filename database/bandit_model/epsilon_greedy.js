var mongoose = require('mongoose');
var BanditModel = require('../bandit_model');

require('mongoose-schema-extend');

var EpsilonGreedy = BanditModel.extend({
	arms: [{
		value: {type: Number, default: 0},
		counts: {type: Number, default: 0}
	}],
	settings: {
		epsilon: {type: Number, required: true},
		total_counts: {type: Number, default: 0}
	}
});

module.exports = mongoose.model('EpsilonGreedy', EpsilonGreedy);
