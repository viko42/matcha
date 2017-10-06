var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var Users		= mongoose.model('Users');
var bcrypt		= require('bcrypt');
var jwt			= require('jsonwebtoken');

exports.list = function (req, res) {
	Users.find({}, function (err, results) {
		if (err)
			return s.serverError(res, err);

		// for (key in results) {
		// 	results[key] = _.pick(results[key], ['id', 'email', 'firstName', 'lastName', 'password']);
		// }
		return res.json(results);
	});
};

exports.create = function(req, res) {
	var new_user = req.body;
	// var new_user = new Users(req.body);

	console.log(new_user);

	if (!new_user)
		return s.badRequest(res, "Missing input")

	if (!new_user.email)
		return s.badRequest(res, {errors: {email: 'Champs manquant'}});

	if (!new_user.password)
		return s.badRequest(res, {errors: {password: 'Password manquant'}});

	if (!new_user.confirmpass)
		return s.badRequest(res, {errors: {confirmpass: 'Champs manquant'}});

	if (new_user.password !== new_user.confirmpass)
		return s.badRequest(res, {errors: {confirmpass: 'Les mots de passe ne sont pas identiques'}});

	if (!new_user.lastName)
		return s.badRequest(res, {errors: {lastName: 'Champs manquant'}});

	if (!new_user.firstName)
		return s.badRequest(res, {errors: {firstName: 'Champs manquant'}});

	if (!new_user.phone)
		return s.badRequest(res, {errors: {phone: 'Champs manquant'}});

	if (!new_user.birth)
		return s.badRequest(res, {errors: {birth: 'Champs manquant'}});

	if (!new_user.sexe)
		return s.badRequest(res, {errors: {swal: 'Champs sexe manquant'}});

	async.waterfall([
		function (callback) {
			Users.findOne({email: new_user.email}, function(err, user) {
				if (err)
					return callback(err);

				if (user)
					return callback({errors: {email: "This email is already in use"}});

				callback();
			});
		},
		function (callback) {
			bcrypt.hash(new_user.password, 10, function(err, hash) {
				if (err)
					return callback(err);

				new_user.password = hash;
				return callback();
			});
		},
		function (callback) {
			new_user = new Users(req.body);
			new_user.save(function(err, user) {
				if (err)
					return callback(err);
				callback(false);
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err);
		return res.status(200).json({message: "User created."});
	})
};

exports.update = function(req, res) {
	console.log(req.body.userId);
	if (!req.body.userId)
		return s.badRequest(res, "user ID is missing");

	// if (you == userId)
	//

	Users.findOneAndUpdate({_id: req.body.userId}, req.body, {new: true}, function(err, user) {
		if (err)
			return s.serverError(res, err);
		res.status(200).json({message: "User updated"});
	});
};

exports.delete = function(req, res) {
	console.log(req.body.userId);
	Users.find({}, function (err, list) {
		console.log(list);
	})
	Users.findOne({'_id': req.body.userId}, function (err, userFound) {
		if (err)
			return s.serverError(res, err);

		if (!userFound)
			return s.badRequest(res, "User not found");

		Users.remove({'_id': req.body.userId}, function(err, user) {
			if (err)
				return s.serverError(res, err);
			return res.status(200).json({message: "User removed!"});
		});
	})
};

exports.login = function(req, res) {
	var auth = req.body;

	if (!auth)
		return s.forbidden(res, {errors: {message: 'connection refused'}});

	if (!auth.email)
		return s.forbidden(res, {errors: {email: 'Champs manquant'}});

	if (!auth.password)
		return s.forbidden(res, {errors: {password: 'Champs manquant'}});

	Users.findOne({email: auth.email}, function(err, user) {
		if (err)
			return s.serverError(res, err);

		if (!user)
			return s.notFound(res, {errors: {swal: 'User not found'}});

		bcrypt.compare(auth.password, user.password, function (err, result) {
			if (result === false)
				return s.forbidden(res, {errors: {swal: "incorrect password"}});

			var token = jwt.sign({id: user.id}, 'ilovescotchyscotch', {
				expiresIn: 1440 // expires in 24 hours
	        });
			return res.status(200).json({message: "Logged!", token: token});
		});
	});
}
