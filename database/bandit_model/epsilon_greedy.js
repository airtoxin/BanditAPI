var mongoose = require('mongoose');
var BanditModel = require('../bandit_model');

require('mongoose-schema-extend');

var EpsilonGreedy = BanditModel.extend({
	arms: [{
		presumption: {type: Number, default: 0}
	}],
	settings: {
		epsilon: {type: Number, required: true},
		counts: {type: Number, default: 1}
	}
});

module.exports = mongoose.model('EpsilonGreedy', EpsilonGreedy);
