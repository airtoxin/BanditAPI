var mongoose = require('mongoose');
var BanditModel = require('../bandit_model');

require('mongoose-schema-extend');

var Ucb1 = BanditModel.extend({
	arms: [{
		name: {type: String},
		value: {type: Number, default: 0},
		counts: {type: Number, default: 0}
	}],
	settings: {
		total_counts: {type: Number, default: 0}
	}
});

module.exports = mongoose.model('Ucb1', Ucb1);
