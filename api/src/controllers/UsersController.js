const mongoose			= require('mongoose');
const s					= require('../config/services');
const async				= require('async');
const _					= require('lodash');
const Users				= mongoose.model('Users');
const Conversations		= mongoose.model('Conversations');
const bcrypt			= require('bcrypt');
const jwt				= require('jsonwebtoken');
const moment			= require('moment');
const thisController	= "UsersController";
const http				= require('http');
const nodemailer		= require('nodemailer');
const generator			= require('generate-password');

const {addScore}		= require('../helpers/score');

exports.reset = function (req, res) {
	const email = req.body.email;
	let	  data = {};

	async.waterfall([
		function (callback) {
			data.code = Math.floor((Math.random() * 90000) + 10000);
			data.message = "Votre code de reinitialisation: "+ data.code;
			return callback();
		},
		function (callback) {
			data.transporter = nodemailer.createTransport({
		        service: 'gmail',
		        auth: {
		            user: 'vlancienpwd@gmail.com',
		            pass: 'QWERTY123'
		        }
			});
			data.mailOptions = {
			        from: "vlancienpwd@gmail.com",
			        to: email,
			        subject: "Reinitialisation de votre mot de passe",
			        text: data.message,
			        html: '<b>' + data.message + '</b>'
			};
			return callback();
		},
		function (callback) {
			Users.findOneAndUpdate({'email': email}, {'data.reset' : data.code}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback("User not found");

				data.transporter.sendMail(data.mailOptions, function(error, info){
					if (error)
						return console.log(email + " unable to send mail. {EMAIL_SENT}");
				});
				data.transporter.close();
				return callback();
			})
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({message: "Code generated!"});
	});
};

exports.newPassword = function (req, res) {
	const code	= req.body.code;
	const email	= req.body.email;
	const newPass	= req.body.newPass;
	const newPassC	= req.body.newPassC;

	async.waterfall([
		function (callback) {
			if (!email)
				return callback({errors: {email: 'Email missing'}});

			if (!code)
				return callback({errors: {code: 'Code missing'}});

			if (!newPass || !newPassC || newPass.length < 5)
				return callback({errors: {newPass: 'Vos mots de passe doivent etre identique et de plus de 5 catacteres.'}});

			Users.findOne({'email': email}).exec(function (err, userFound) {
				if (err)
					return callback(err);


				if (!userFound || Number(userFound.data.reset) !== Number(code))
					return callback({errors: {swal: "Utilisateur introuvable ou code incorrect"}});

				bcrypt.hash(newPass, 10, function(err, hash) {
					if (err)
						return callback(err);

					userFound.password = hash;
					userFound.data.reset = null;
					userFound = new Users(userFound);
					userFound.save(function (err, userSaved) {
						if (err)
							return callback(err)
						return callback();
					});
				});
			});
		},
	], function (err) {
		if (err)
			return s.forbidden(res, err, thisController);
		return res.status(200).json({message: "Password reset!"});
	});

};
exports.import = function (req, res) {
	var new_user = req.body;

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

	if (!new_user.birth || !moment(new_user.birth, ["DD MMMM, YYYY"]).isValid())
		return s.badRequest(res, {errors: {birth: 'Champs manquant'}});

	if (moment().diff(moment(new_user.birth, ["DD MMMM, YYYY"]).format(), 'years') < 18)
		return s.badRequest(res, {errors: {swal: 'Vous devez avoir plus de 18 ans.'}});

	// if (!new_user.sexe)
	// 	return s.badRequest(res, {errors: {swal: 'Champs sexe manquant'}});

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
			if (new_user.localization && new_user.localization.lng && new_user.localization.lat)
				return callback();

			let positions = {};
			http.get('http://ip-api.com/json', (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('error', () => {
					new_user.localization	= {
						lat: 0,
						lng: 0,
					}
				});

				resp.on('end', () => {
					positions				= JSON.parse(data);
					new_user.localization	= {
						lat: positions.lat,
						lng: positions.lon,
					}
					return callback();
				});
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
			var arrayLocation = [];

			arrayLocation.push(new_user.localization.lng);
			arrayLocation.push(new_user.localization.lat);

			new_user.data = {
				profile: {
					sexe: new_user.sexe ? new_user.sexe : 'Non renseigné',
					orientation: new_user.orientation ? new_user.orientation : 'Non renseigné'
				},
				pictures: [],
				score: 0
			};
			new_user.location = arrayLocation;
			new_user.birth = moment(new_user.birth, ["DD MMMM, YYYY"]).format();

			new_user = new Users(req.body);
			new_user.save(function(err, user) {
				if (err)
					return callback(err);
				callback(false);
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({message: "User created."});
	})
};

exports.tags = function (req, res) {
	const userId = req.connectedAs.id;

	Users.findOne({'_id': userId}).exec(function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!userFound)
			return s.badRequest(res, {errors: "User not found"}, thisController);

		return res.status(200).json({tags: userFound.data.profile.tags});
	})
};

exports.block = function (req, res) {
	const blockUser = req.body;

	var	blockedUsers;
	var action = "add";

	if (!blockUser || !blockUser.id)
		return s.notFound(res, {errors: "Incomplete request"}, thisController);

	if (blockUser.id === req.connectedAs.id)
		return s.notFound(res, {errors: "Unable to block"}, thisController);

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
				if (err)
					return callback(err, true);

				if (!userFound)
					return callback('User not found', false);

				blockedUsers = userFound.blocked;

				if (!blockedUsers)
					blockedUsers = [];

				let remove = false;
				for (var i = 0; i < blockedUsers.length; i++) {
					if (blockedUsers[i] === blockUser.id)
						remove = true;
				}

				if (remove) {
					action = "remove";
					addScore(blockUser.id, 10);
					blockedUsers = _.filter(blockedUsers, function(currentObject) {
					    return currentObject !== blockUser.id;
					});
				} else
					blockedUsers.push(blockUser.id);
				return callback();
			})
		},
		function (callback) {
			if (action === "remove")
				return callback();

			addScore(blockUser.id, -10);
			Conversations.findOne({$or: [{sender: blockUser.id, recipent: req.connectedAs.id}, {sender: req.connectedAs.id, recipent: blockUser.id}]}).exec(function (err, conversationFound) {
				if (err)
					return callback(err);

				if (!conversationFound)
					return callback();

				Conversations.remove({'_id': conversationFound.id}).exec(function (err, conversationDeleted) {
					if (err)
						return callback(err);
					return callback();
				});
			});
		},
		function (callback) {
			Users.findOne({'_id': blockUser.id}).exec(function (err, userToBlock) {
				if (err)
					return callback(err, true);

				if (!userToBlock)
					return callback({errors: {swal: 'User not found'}}, false);

				Users.update({'_id': req.connectedAs.id}, {blocked: blockedUsers}).exec(function (err, userUpdated) {
					if (err)
						return callback(err, true);
					return callback();
				});
			})
		},
	], function (err, isFatal) {
		if (err && isFatal)
			return s.badRequest(res, err, thisController);

		if (err && !isFatal)
			return s.notFound(res, err, thisController);

		return res.status(200).json({message: "User blocked!", action: action === "remove" ? "deleted" : "added"});
	});
};

exports.list = function (req, res) {
	Users.find({}, function (err, results) {
		if (err)
			return s.badRequest(res, err, thisController);

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

	if (new_user.password.length < 5)
		return s.badRequest(res, {errors: {password: 'Votre mot de passe doit etre plus grand que 5 caracteres.'}});

	if (!new_user.password.match('[0-9]'))
		return s.badRequest(res, {errors: {password: 'Votre mot de passe doit avoir au moins un chiffre.'}});

	if (!new_user.confirmpass)
		return s.badRequest(res, {errors: {confirmpass: 'Champs manquant'}});

	if (new_user.password !== new_user.confirmpass)
		return s.badRequest(res, {errors: {confirmpass: 'Les mots de passe ne sont pas identiques'}});

	if (!new_user.username)
		return s.badRequest(res, {errors: {username: 'Champs manquant'}});

	if (!new_user.lastName)
		return s.badRequest(res, {errors: {lastName: 'Champs manquant'}});

	if (!new_user.firstName)
		return s.badRequest(res, {errors: {firstName: 'Champs manquant'}});

	if (!new_user.phone)
		return s.badRequest(res, {errors: {phone: 'Champs manquant'}});

	if (!new_user.birth || !moment(new_user.birth, ["DD MMMM, YYYY"]).isValid())
		return s.badRequest(res, {errors: {birth: 'Champs manquant'}});

	if (moment().diff(moment(new_user.birth, ["DD MMMM, YYYY"]).format(), 'years') < 18)
		return s.badRequest(res, {errors: {swal: 'Vous devez avoir plus de 18 ans.'}});

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
			if (new_user.localization && new_user.localization.lng && new_user.localization.lat)
				return callback();

			let positions = {};
			http.get('http://ip-api.com/json', (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('error', () => {
					new_user.localization	= {
						lat: 0,
						lng: 0,
					}
				});

				resp.on('end', () => {
					positions				= JSON.parse(data);
					new_user.localization	= {
						lat: positions.lat,
						lng: positions.lon,
					}
					return callback();
				});
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
			var arrayLocation = [];

			arrayLocation.push(new_user.localization.lng);
			arrayLocation.push(new_user.localization.lat);

			new_user.data = {
				profile: {
					sexe: 'Non renseigné',
					orientation: 'Non renseigné'
				},
				pictures: [],
				score: 0
			};
			new_user.location = arrayLocation;
			new_user.birth = moment(new_user.birth, ["DD MMMM, YYYY"]).format();

			new_user = new Users(req.body);
			new_user.save(function(err, user) {
				if (err)
					return callback(err);
				callback(false);
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({message: "User created."});
	})
};

exports.update = function(req, res) {
	if (!req.body.userId)
		return s.badRequest(res, "user ID is missing", thisController);

	if (req.connectedAs.id !== req.body.userId)
		return s.badRequest(res, "No sorry", thisController);

	Users.findOneAndUpdate({_id: req.body.userId}, req.body, {new: true}, function(err, user) {
		if (err)
			return s.badRequest(res, err, thisController);
		res.status(200).json({message: "User updated"});
	});
};

exports.delete = function(req, res) {
	Users.findOne({'_id': req.body.userId}, function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!userFound)
			return s.badRequest(res, "User not found", thisController);

		Users.remove({'_id': req.body.userId}, function(err, user) {
			if (err)
				return s.badRequest(res, err, thisController);
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
		});
	})
};

exports.login = function(req, res) {
	var auth = req.body;

	if (!auth)
		return s.forbidden(res, {errors: {message: 'connection refused'}}, thisController);

	if (!auth.login)
		return s.forbidden(res, {errors: {login: 'Champs manquant'}}, thisController);

	if (!auth.password)
		return s.forbidden(res, {errors: {password: 'Champs manquant'}}, thisController);

	if (!auth.socketId)
		return s.forbidden(res, {errors: {swal: 'Rechargez la page'}}, thisController);

	Users.findOne({$or: [{email: auth.login}, {username: auth.login}]}, function(err, user) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!user)
			return s.notFound(res, {errors: {swal: 'User not found'}}, thisController);

		bcrypt.compare(auth.password, user.password, function (err, result) {
			if (result === false)
				return s.forbidden(res, {errors: {swal: "incorrect password"}}, thisController);

			var token = jwt.sign({id: user.id}, 'ilovescotchyscotch', {
				// expiresIn: 1440 // expires in 24 hours
	        });
				return res.status(200).json({data: {firstName: user.firstName, lastName: user.lastName, phone: user.phone, birth: user.birth, username: user.username}, token: token});
		});
	});
}
