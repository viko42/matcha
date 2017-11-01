var mongoose	= require('mongoose');
var Users		= mongoose.model('Users');
var s			= require('../config/services');
var async		= require('async');

// Verify if 'TO' block 'FROM'
exports.isBlokedSocket = function(fromId, toSocket, call) {
	var idRecipent = false;

	async.waterfall([
		function (callback) {
			Users.findOne({'data.socketid': toSocket}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound) {
					console.log('No user found');
					return callback('error');
				}

				for (var i = 0; i < userFound.blocked.length; i++) {
					if (userFound.blocked[i] === fromId) {
						console.log('User blocked, no notification');
						return callback('Blocked');
					}
				}
				idRecipent = userFound.id;
				return callback();
			});
		},
	], function (err) {
		if (err)
			return call(null);
		return call(toSocket, idRecipent);
	});
};

exports.isBlocked = function(idFrom, idTo, call) {
	async.waterfall([
		function (callback) {
			Users.findOne({'_id': idTo}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound) {
					return callback('error');
				}

				for (var i = 0; i < userFound.blocked.length; i++) {
					if (userFound.blocked[i] === idFrom) {
						return callback('Blocked');
					}
				}
				return callback();
			});
		},
	], function (err) {
		if (err)
			return call(true);
		return call(false);
	});
};
