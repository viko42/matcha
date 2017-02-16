import mongoose from 'mongoose'
// import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const connect = mongoose.connect('mongodb://vlancien:qwqwqw@ds117889.mlab.com:17889/matcha42vlancien');
// autoIncrement.initialize(connect);
// unique: false
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	admin: {
		type: Number
	},
	activate: {
		type: Number
	}
});


// UserSchema.plugin(autoIncrement.plugin, 'User');
const UsersX = mongoose.model('User', UserSchema);
console.log('DB User created !');

export default UsersX;

// Users.remove(function(err) {
// 	if (err) throw err;
// 	console.log('User successfully deleted!');
// });
// import db_create from './db.create'
// import db_find from './db.find_all'

// User.find({}, function(err, users) {
// 	if (err)
// 	throw err;
// 	console.log(users);
// 	console.log('Found');
// });


// delete him
