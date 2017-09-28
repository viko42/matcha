var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: String,
		required: true
	},
	recipent: {
		type: String,
		required: true
	},
	// localization: {
	// 	type: String
	// },
	// created_at: {
	// 	type: Date
	// },
	data: {
		type: Object,
		required: false,
		default: {}
	},
	status: {
		type: [{
			type: String,
			enum: ["sended", "readed"]
		}],
		default: ["sended"]
	}
});

module.exports = mongoose.model('Messages', MessagesSchema);
