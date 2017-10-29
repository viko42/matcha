var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var moment				= require('moment');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Notifications		= mongoose.model('Notifications');
var Conversations		= mongoose.model('Conversations');
const thisController	= "CrushsController";
const {isBlocked}		= require('../policies/isBlocked');

exports.getSocketIdTarget = function (data, socket, callback) {
	const	profileId = data.id;

	Users.findOne({'_id': profileId}).exec(function (err, userFound) {
		if (err)
			return callback(err);

		if (!userFound)
			return callback(profileId + ' not found. [CRUSHS-CONTROLLER]');

		return callback(null, userFound.data.socketid);
	});
}

exports.listLikes		= function (req, res) {
	const userId		= req.connectedAs.id;

	var crushs = [];

	async.waterfall([
		function (callback) {
			Crushs.find({to: userId}).populate('to').populate('from').exec(function (err, crushFound) {
				if (err)
					return callback(err);

				async.forEachOf(crushFound, function (crush, keyCrush, next_crush) {
					Crushs.findOne({'from': userId, 'to': crush.from.id}).exec(function (err, doubleCrushFound) {
						if (err)
							return next_crush(err);

						if (!doubleCrushFound)
							crushs.push({firstName: crush.from.firstName, lastName: crush.from.lastName, profileId: crush.from.id, age: moment().diff(crush.from.birth, 'years')})
						next_crush();
					});
				}, function (err) {
					if (err)
						return callback(err);
					return callback();
				});
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "List Likes!", likes: crushs});
	});
};

exports.listCrush		= function (req, res) {
	const userId		= req.connectedAs.id;

	var crushs = [];

	async.waterfall([
		function (callback) {
			Crushs.find({to: userId}).populate('to').populate('from').exec(function (err, crushFound) {
				if (err)
					return callback(err);

				async.forEachOf(crushFound, function (crush, keyCrush, next_crush) {
					Crushs.findOne({'from': userId, 'to': crush.from.id}).exec(function (err, doubleCrushFound) {
						if (err)
							return next_crush(err);

							console.log(crush.from.birth);
						if (doubleCrushFound)
							crushs.push({firstName: crush.from.firstName, lastName: crush.from.lastName, profileId: crush.from.id, age: moment().diff(crush.from.birth, 'years')})
						next_crush();
					});
				}, function (err) {
					if (err)
						return callback(err);
					return callback();
				});
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "List Crush!", crushs: crushs});
	});
};

exports.startConversation = function (req, res) {
	const userId		= req.connectedAs.id;
	const crushTarget	= req.params.id;

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': crushTarget}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User target not found');
				return callback();
			});
		},
		function (callback) {
			Crushs.find({$or: [{from: userId, to: crushTarget}, {to: userId, from: crushTarget}]}).exec(function (err, crushFound) {
				if (err)
					return callback(err);

				if (!crushFound || crushFound.length !== 2)
					return callback({swal: 'You have to crush together'});

				return callback();
			});
		},
		function (callback) {
			var new_conv = new Conversations({
				sender: userId,
				recipent: crushTarget,
				premium: false,
			});

			Conversations.findOne({$or: [ {sender: userId, recipent: crushTarget}, {recipent: userId, sender: crushTarget}]}).exec(function (err, convFound) {
				if (err)
					return callback(err);

				if (convFound)
					return callback();

				new_conv.save(function (err, convSaved) {
					if (err)
						return callback(err);
					return callback();
				});
			})
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "Conversation started!"});
	});
};


exports.removeCrush = function (req, res) {
	const userId		= req.connectedAs.id;
	const crushTarget	= req.params.id;

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': crushTarget}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User target not found');
				return callback();
			});
		},
		function (callback) {
			Crushs.findOne({from: userId, to: crushTarget}).exec(function (err, crushFound) {
				if (err)
					return callback(err);

				if (!crushFound)
					return callback({swal: 'Crush not done'});

				Crushs.remove({'_id': crushFound.id}).exec(function (err, crushRemoved) {
					if (err)
						return callback(err);
					return callback();
				});
			});
		},
		// Create Notification
		function (callback) {
			var new_notification = new Notifications({
				from:		userId,
				to:			crushTarget,
				type:		"unlike",
				status:		"unread",
				created_at: new Date()
			});

			new_notification.save(function (err, notifSaved) {
				if (err)
					return callback(err);
				// console.log('Notification pushed');
				return callback();
			});
		},
		function (callback) {
			Conversations.findOne({$or: [{sender: userId, recipent: crushTarget}, {sender: crushTarget, recipent: userId}]}).exec(function (err, conversationFound) {
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
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "Crush removed!"});
	});
};


exports.doCrush = function (req, res) {
	const userId		= req.connectedAs.id;
	const crushTarget	= req.params.id;
	var	  doubleCrush	= false;

	async.waterfall([
		//Verify if user have avatar
		function (callback) {
			Users.findOne({'_id': userId}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User not found');

				if (!userFound.data.pictures || userFound.data.pictures.length < 1)
					return callback({swal: "Vous devez avoir une photo de profile"});
				return callback();
			});
		},
		function (callback) {
			Users.findOne({'_id': crushTarget}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User target not found');
				return callback();
			});
		},
		function (callback) {
			Crushs.findOne({from: userId, to: crushTarget}).exec(function (err, crushFound) {
				if (err)
					return callback(err);

				if (crushFound)
					return callback({swal: 'Crush already done'});

				var crush = new Crushs({
					from: userId,
					to: crushTarget,
					type: 'normal'
				});

				isBlocked(userId, crushTarget, function (isBlocked) {
					if (isBlocked)
						return callback({swal: "Vous ne pouvez pas liker cette personne."});

					crush.save(function (err, crushSaved) {
						if (err)
							return callback(err);
						return callback();
					});
				});
			});
		},
		function (callback) {
			Crushs.find({$or: [{from: userId, to: crushTarget}, {to: userId, from: crushTarget}]}).exec(function (err, crushTotal) {
				if (err)
					return callback(err);

				if (crushTotal.length === 2)
					doubleCrush = true;

				return callback();
			});
		},
		// Create Notification
		function (callback) {
			var new_notification = new Notifications({
				from:		userId,
				to:			crushTarget,
				type:		doubleCrush ? "crush" : "like",
				status:		"unread",
				created_at: new Date()
			});

			new_notification.save(function (err, notifSaved) {
				if (err)
					return callback(err);
				// console.log('Notification pushed');
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);

		return res.status(200).json({message: "Crush done!", doubleCrush: doubleCrush});
	});
};
