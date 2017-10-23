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
	birth: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},
	blocked: {
		type: Array,
		required: false
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

UsersSchema.methods.clearData = function (params, callback) {
	for (var i = 0; i < params.length; i++) {
		console.log(params[i]);
	}
	return callback();
};

module.exports = mongoose.model('Users', UsersSchema);
