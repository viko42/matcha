var jwt			= require('jsonwebtoken');
var mongoose	= require('mongoose');
var Users		= mongoose.model('Users');
var s			= require('../config/services');
var async		= require('async');

exports.authorization = function(req, res, next) {
	var token = req.headers["authorization"];

	async.waterfall([
		function (callback) {
			jwt.verify(token, 'ilovescotchyscotch', function (err, verifiedToken) {
				if (err || !verifiedToken.id)
					return callback('invalid token');

				token = verifiedToken;
				return callback();
			});
		},
		function (callback) {
			Users.findOne({'_id': token.id}, function (err, user) {
				if (err)
					return callback(err);

				if (!user)
					return callback('User not found');
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.forbidden(res, err);
		return next();
	});
};
