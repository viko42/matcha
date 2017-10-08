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
	}
});

module.exports = mongoose.model('Conversations', ConversationsSchema);
