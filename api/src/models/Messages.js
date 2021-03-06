var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	conversation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Conversations'
	},
	// localization: {
	// 	type: String
	// },
	created_at: {
		type: Date,
		required: true
	},
	// data: {
	// 	type: Object,
	// 	required: false,
	// 	default: {}
	// },
	status: {
		type: [{
			type: String,
			enum: ["sended", "readed"]
		}],
		default: ["sended"]
	}
});

module.exports = mongoose.model('Messages', MessagesSchema);
