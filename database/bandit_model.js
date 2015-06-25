var mongoose = require('mongoose');

var BanditModel = new mongoose.Schema({
	algorithm: {type: String, required: true},
	/* arms: [{type: mongoose.Schema.Types.Mixed, required:true}] */
	/* settings: {type: mongoose.Schema.Types.Mixed} */
	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now}
}, {
	discriminatorKey: 'algorithm',
	collection: 'banditmodels'
});

BanditModel.pre('update', function (next) {
	this.updated = Date.now();
	next();
});

module.exports = BanditModel;
