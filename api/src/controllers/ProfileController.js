const mongoose	= require('mongoose');
const fs		= require('fs');
const s			= require('../config/services');
const async		= require('async');
const _			= require('lodash');
const moment	= require('moment');
const Users		= mongoose.model('Users');
const Crushs	= mongoose.model('Crushs');
const thisController	= "ProfileController";

// var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

// var base64Img = require('base64-img');

exports.findAvatar = function (req, res) {
	let id = req.params.id;

	if (!id && req.connectedAs && req.connectedAs.id)
		id = req.connectedAs.id;

	if (!id)
		return s.badRequest(res, "ID Missing", thisController);

	Users.findOne({$or: [{'username': id}] }).exec(function(err, userFound) {
		if (err)
			return s.badRequest(res, "Profile introuvable: " + id, thisController);

		if (!userFound)
			return s.badRequest(res, "User not found", thisController);

		var isAvatar = true;

		if (!userFound || !userFound.data.pictures || (!userFound.data.avatarID && !userFound.data.pictures[0]))
			isAvatar = false;

		if (!userFound.data.avatarID || !userFound.data.pictures[userFound.data.avatarID])
			userFound.data.avatarID = 0;

		if (!isAvatar || !userFound.data.pictures[userFound.data.avatarID])
			return res.status(200).json({src: "http://www.bmxpugetville.fr/wp-content/uploads/2015/09/avatar.jpg"});

		return res.status(200).json({src: userFound.data.pictures[userFound.data.avatarID].data});

		// server.get("/api/id/:w", function(req, res) {
	    // var data = userFound.data.pictures[userFound.data.avatarID].data;
		//
		// fs.readFile('./uploads/'+id+'.png', function(err, data) {
		// 	if (err) throw err;
		// 	else
				// res.end(userFound.data.pictures[userFound.data.avatarID].data);
		// });
   });
};
exports.changeAvatar = function (req, res) {
	const idPicture = req.body.id;

	if (!idPicture || idPicture > 4 || idPicture < 0)
		return s.badRequest(res, {errors: {swal: "Veuillez sélectionner une image"}}, thisController);

	Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!userFound)
			return s.badRequest(res, {errors: {swal: "Utilisateur introuvable"}}, thisController);

		var data = userFound.data;

		data.avatarID = idPicture;
		Users.update({'_id': userFound.id}, {data: data}).exec(function (err, userUpdated) {
			if (err)
				return s.badRequest(res, err, thisController);

			if (!userFound.data.pictures[idPicture])
				return res.status(200).json({});

			// base64Img.img(userFound.data.pictures[idPicture].data, 'uploads', userFound.username, function(err, filepath) {
				return res.status(200).json({});
			// });
		});
	});
};
exports.deleteAvatar = function (req, res) {
	const idPicture = req.body.id;

	if (!idPicture || idPicture > 4 || idPicture < 0)
		return s.badRequest(res, {errors: {swal: "Veuillez sélectionner une image"}}, thisController);

	Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!userFound)
			return s.badRequest(res, {errors: {swal: "Utilisateur introuvable"}}, thisController);

		var data = userFound.data;

		var updatePictures = [];

		for (var i = 0; i < data.pictures.length; i++) {
			if (i !== Number(idPicture))
				updatePictures.push(data.pictures[i]);
		}
		data.pictures = updatePictures;
		Users.update({'_id': userFound.id}, {data: data}).exec(function (err, userUpdated) {
			if (err)
				return s.badRequest(res, err, thisController);

			// fs.unlink('./uploads/',function(err){
			// 	if(err) return console.log(err);
			// 	console.log('file deleted successfully');
			// });
			return res.status(200).json({});
		});
	});
};
exports.uploadImage = function(req, res) {
	Users.findOne({'_id': req.connectedAs}).exec(function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		var data = userFound.data;

		if (!data.pictures)
			data.pictures = [];

		if (data.pictures.length === 5)
			return s.forbidden(res, {errors: {swal: "Vous avez atteint le quota d'image sur votre profile."}}, thisController);

		data.pictures.push({data: req.body.file});
		Users.update({'_id': userFound.id}, {data: data}).exec(function (err, userUpdated) {
			if (err)
				return s.badRequest(res, err, thisController);

			// base64Img.img(data, 'uploads', userFound.username, function(err, filepath) {
				return res.status(200).json({});
			// });
		})
	})
};
exports.updateProfile = function (req, res) {
	const userId	= req.connectedAs.id;
	const data		= req.body;
	var myDataProfile	= {};
	var userData		= {};

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': userId}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User not found');

				userData = userFound;
				if (!userData.data.profile)
					userData.data.profile = {};
				return callback();
			});
		},
		function (callback) {
			if (data.aboutMe)
				userData.data.profile.aboutMe		= data.aboutMe;
			if (data.whyMe)
				userData.data.profile.whyMe			= data.whyMe;
			if (data.myInfosSexe)
				userData.data.profile.sexe			= data.myInfosSexe;
			if (data.myInfosOrientation)
				userData.data.profile.orientation	= data.myInfosOrientation;

			if (data.myLibraryCat && data.myLibrary) {
				if (!userData.data.profile[data.myLibraryCat])
					userData.data.profile[data.myLibraryCat] = [];
				userData.data.profile[data.myLibraryCat].push(data.myLibrary);
			}

			return callback();
		},
		function (callback) {
			Users.findOneAndUpdate({_id: userId}, userData, {new: true}, function(err, user) {
				if (err)
					return callback(err);
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({message: "Profile updated"});
	});
};
exports.getProfile = function(req, res) {
	var profile		= req.params;
	var crushDone	= false;
	var doubleCrush	= false;
	var blocked		= false;

	if (!profile.id)
		return s.badRequest(res, "Missing profile ID", thisController)

	if (profile.id === 'me')
		profile.id = req.connectedAs.id;

	async.waterfall([
		function (callback) {
			Crushs.findOne({from: req.connectedAs.id, to: profile.id}).exec(function (err, crush) {
				if (err)
					return callback(err);

				if (crush)
					crushDone = true;
				return callback();
			});
		},
		function (callback) {
			Crushs.findOne({to: req.connectedAs.id, from: profile.id}).exec(function (err, crush) {
				if (err)
					return callback(err);

				if (crushDone && crush)
					doubleCrush = true;
				return callback();
			});
		},
		function (callback) {
			Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User not found')

				for (var i = 0; i < userFound.blocked.length; i++) {
					if (userFound.blocked[i] === profile.id)
						blocked = true;
				}
				return callback();
			});
		},
		function (callback) {
			Users.findOne({'_id': profile.id}, function(err, user) {
				if (err)
					return callback(err);

				if (!user)
					return callback("User not found");

				if (user.data.profile && !user.data.profile.tags)
					user.data.profile.tags = [];

				profile = {
					...user.data.profile,
					firstName: user.firstName,
					lastName: user.lastName,
					me: profile.id === req.connectedAs.id ? true : false,
					crushed: crushDone,
					doubleCrush: doubleCrush,
					connected: user.data.status === 'online' ? true : false,
					status: user.data.status === 'online' ? "online" : "offline",
					last_activity: moment(user.data.last_activity).format('DD/MM HH:mm'),
					pictures: user.data.pictures,
					id: user.id,
					blocked: blocked,
					username: user.username,
					score: user.data.score ? user.data.score : 0,
				};
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);
		return res.status(200).json({profile: profile});
	});
};
