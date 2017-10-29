var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationsSchema = new Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	type: {
		type: [{
			type: String,
			enum: ["alert", "message", "like", "unlike", "crush", "visit"]
		}],
		default: ["alert"]
	},
	status: {
		type: [{
			type: String,
			enum: ["read", "unread"]
		}],
		default: ["unread"]
	},
	create_at: {
		type: Date,
		required: false
	}
});

module.exports = mongoose.model('Notifications', NotificationsSchema);
