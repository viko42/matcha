var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: {
		type: String,
		required: false
	},
	status: {
		type: [{
			type: String,
			enum: ["correct", "incorrect", "pending"]
		}],
		default: ["pending"]
	}
});

module.exports = mongoose.model('Tasks', TaskSchema);
