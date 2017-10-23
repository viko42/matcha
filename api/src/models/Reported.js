var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportedSchema = new Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	reportedId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	date: {
		type: Date,
		required: false,
	},
});

module.exports = mongoose.model('Reported', ReportedSchema);
