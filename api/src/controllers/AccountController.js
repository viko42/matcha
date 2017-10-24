var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var bcrypt		= require('bcrypt');
var Users		= mongoose.model('Users');

const thisController	= "AccountController";
const NodeGeocoder		= require('node-geocoder');

const options = { provider: 'google', httpAdapter: 'https', apiKey: 'AIzaSyAWyS9AomCahBfTue98dIGMcCozwbgKBbc', formatter: null };

const geocoder = NodeGeocoder(options);

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

exports.updateLocalization = function (req, res) {
	const data = req.body.localization;

	if (!data || !data.lng || !data.lat)
		return s.badRequest(res, "Il manque des elements dans la requete", thisController);

	async.waterfall([
		// Verify the localization
		function (callback) {
			geocoder.reverse({lat:Number(data.lat), lon:Number(data.lng)}, function(err, res) {
				if (!res)
					return callback('Address not found');
				return callback()
			});
		},
		//Update the localization
		function (callback) {
			Users.findOneAndUpdate({'_id': req.connectedAs.id}, {'data.localization': data}, {new: true}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User not updated');
				return callback()
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({});
	})
};
