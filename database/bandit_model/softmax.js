var mongoose = require('mongoose');
var BanditModel = require('../bandit_model');

require('mongoose-schema-extend');

var Softmax = BanditModel.extend({
	arms: [{
		name: {type: String},
		value: {type: Number, default: 0},
		counts: {type: Number, default: 0}
	}],
	settings: {
		tau: {type: Number, required: true}, // temperature
		total_counts: {type: Number, default: 0}
	}
});

module.exports = mongoose.model('Softmax', Softmax);
