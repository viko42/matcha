var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var bcrypt		= require('bcrypt');
var Users		= mongoose.model('Users');
const thisController	= "AccountController";

// var bcrypt		= require('bcrypt');
// exports.myProfile = function(req, res) {
// 		// return s.badRequest(res, err);
// 		// return res.status(200).json({message: "Show user info."});
// 	// })
// };


exports.update = function(req, res) {
	const user = new Users(req.connectedAs);

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': req.connectedAs._id}, function(err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback("User not found");

				if (req.body.email === userFound.email)
					req.body.email = false;

				if (req.body.email && !String(req.body.email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
					return callback({errors: {swal: 'Email invalide'}});

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
			if (!req.body.firstName)
				return callback();
			user.firstName = req.body.firstName;
			return callback();
		},
		function (callback) {
			if (!req.body.lastName)
				return callback();
			user.lastName = req.body.lastName;
			return callback();
		},
		function (callback) {
			if (!req.body.email)
				return callback();

			user.email = req.body.email;
			Users.findOne({'email': user.email}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (userFound)
					return callback({errors: {swal: 'Email deja prise'}});

				return callback();
			});
		},
		function (callback) {
			user.save(function(err, userUpdated) {
				if (err)
					return callback(err);
				return callback(false);
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({data: {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, birth: user.birth}});
	})
};
