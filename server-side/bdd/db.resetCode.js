const mongoose = require('mongoose')
// import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema
// mongoose.Promise = global.Promise;

// const connect = mongoose.createConnection('mongodb://vlancien:qwqwqw@ds117889.mlab.com:17889/matcha42vlancien');
// autoIncrement.initialize(connect);
// unique: false
const RCodeSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	RCode: {
		type: Number,
		required: true
	}
});

// RCodeSchema.plugin(autoIncrement.plugin, 'RCode');
const RCode = mongoose.model('RCode', RCodeSchema);

export default RCode;
