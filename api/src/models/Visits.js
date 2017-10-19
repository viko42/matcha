var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitsSchema = new Schema({
	visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	date: {
		type: Date,
		required: false,
	},
});

module.exports = mongoose.model('Visits', VisitsSchema);
