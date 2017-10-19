const mongoose	= require('mongoose');
const s			= require('../config/services');
const async		= require('async');
const _			= require('lodash');
const Users		= mongoose.model('Users');
const bcrypt	= require('bcrypt');
const jwt		= require('jsonwebtoken');
const moment	= require('moment');

exports.block = function (req, res) {

};

exports.report = function (req, res) {

};

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

			new_user.data = {
				profile: {
					sexe: 'Non renseigné',
					orientation: 'Non renseigné'
				}
			}
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
	// Users.find({}, function (err, list) {
	// 	console.log(list);
	// })
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

exports.logout = function (socket) {
	Users.findOne({"_id": socket.handshake.query.userId}).exec(function (err, userFound) {
		if (err || !userFound)
			return ;

		var updateUser = new Users(userFound);
		updateUser.data.socketid = null;
		updateUser.data.status			= 'offline';
		updateUser.data.last_activity	= moment().format();
		updateUser.save(function (err, userSaved) {
			if (err)
				return ;
			console.log('User removed socket in DB!');
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

	if (!auth.socketId)
		return s.forbidden(res, {errors: {swal: 'Rechargez la page'}});

	Users.findOne({email: auth.email}, function(err, user) {
		if (err)
			return s.serverError(res, err);

		if (!user)
			return s.notFound(res, {errors: {swal: 'User not found'}});

		bcrypt.compare(auth.password, user.password, function (err, result) {
			if (result === false)
				return s.forbidden(res, {errors: {swal: "incorrect password"}});

			var token = jwt.sign({id: user.id}, 'ilovescotchyscotch', {
				// expiresIn: 1440 // expires in 24 hours
	        });
			// var toUpdate = new Users(user);
			// toUpdate.save(function (err, userSaved) {
				// if (err)
					// console.log('Unable to update socket');

				// console.log('Socket of a guest as been saved to the logged user');
				return res.status(200).json({data: {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, birth: user.birth}, token: token});
			// })
		});
	});
}
