var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationsSchema = new Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	recipent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	premium: {
		type: Boolean,
		required: false,
		default: false
	},
	last_activity: {
		type: String,
		required: false
	}
	// messages: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Messages'
	// }]
});

module.exports = mongoose.model('Conversations', ConversationsSchema);
