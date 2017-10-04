var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var Users		= mongoose.model('Users');

// var bcrypt		= require('bcrypt');
// exports.myProfile = function(req, res) {
// 		// return s.badRequest(res, err);
// 		// return res.status(200).json({message: "Show user info."});
// 	// })
// };


exports.userProfile = function(req, res) {
	var profile = req.params;

	if (!profile.id)
		return s.badRequest(res, "Missing profile ID")

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': profile.id}, function(err, user) {
				if (err)
					return callback(err);

				if (!user)
					return callback("User not found");

				profile = {
					surnom: user.firstName
				};
				callback();
			});
		},
	], function (err) {
		if (err)
			return s.serverError(res, err);
		return res.status(200).json({profile});
	})
};
