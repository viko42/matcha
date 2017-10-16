var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrushsSchema = new Schema({
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
			enum: ["normal", "super"]
		}],
		default: ["normal"]
	}
});

module.exports = mongoose.model('Crushs', CrushsSchema);
