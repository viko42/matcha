var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var bcrypt		= require('bcrypt');
var Users		= mongoose.model('Users');

// var bcrypt		= require('bcrypt');
// exports.myProfile = function(req, res) {
// 		// return s.badRequest(res, err);
// 		// return res.status(200).json({message: "Show user info."});
// 	// })
// };


exports.update = function(req, res) {
	const user = new Users(req.connectedAs);

	console.log(req.body);
	async.waterfall([
		function (callback) {
			Users.findOne({'_id': req.connectedAs._id}, function(err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback("User not found");

				return callback();
			});
		},
		function (callback) {
			if (!req.body.password)
				return callback();

			bcrypt.hash(req.body.password, 10, function(err, hash) {
				if (err)
					return callback(err);

				user.password = hash;
				return callback();
			});
		},
		function (callback) {
			if (!req.body.phone)
				return callback();
			user.phone = req.body.phone;
			return callback();
		},
		function (callback) {
			// try {
				user.save(function(err, userUpdated) {
					if (err)
						return callback(err);
						console.log(userUpdated);
					return callback(false);
				});
			// }
			// catch (Error$e) {
				// return callback('error');
			// }
		},
	], function (err) {
		if (err)
			return s.serverError(res, err);
		// console.log(req.connectedAs);
		console.log(user);
		return res.status(200).json({data: {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, birth: user.birth}});
	})
};
