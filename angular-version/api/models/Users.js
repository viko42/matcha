var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	data: {
		type: Object,
		required: false,
		default: {}
	},
	status: {
		type: [{
			type: String,
			enum: ["waiting_activation", "blocked", "active"]
		}],
		default: ["waiting_activation"]
	}
});

module.exports = mongoose.model('Users', UsersSchema);
