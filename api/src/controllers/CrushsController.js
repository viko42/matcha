var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Conversations		= mongoose.model('Conversations');

exports.listCrush		= function (req, res) {
	const userId		= req.connectedAs.id;

	var crushs = [];

	async.waterfall([
		function (callback) {
			Crushs.find({to: userId}).populate('to').populate('from').exec(function (err, crushFound) {
				if (err)
					return callback(err);

					console.log(crushFound);
				async.forEachOf(crushFound, function (crush, keyCrush, next_crush) {

					Crushs.findOne({'from': userId, 'to': crush._id}).exec(function (err, doubleCrushFound) {
						if (err)
							return next_crush(err);

						console.log(crush.firstName + ' ma crush ? ');
						console.log(doubleCrushFound);
						if (doubleCrushFound)
							crushs.push({firstName: crush.from.firstName, lastName: crush.from.firstName, id: crush.from.id})

						next_crush();

					});
				}, function (err) {
					if (err)
						return callback(err);
					return callback();
				});
				// for (var i = 0; i < crushFound.length; i++) {
				// 	console.log(crushFound[i].from.firstName + ' ma like');
				// }
				// if (!crushFound || crushFound.length !== 2)
				// 	return callback({swal: 'You have to crush together'});
				// console.log(crushFound);
				// return callback();
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err});
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
			return s.notFound(res, {errors: err});
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
			return s.notFound(res, {errors: err});
		return res.status(200).json({message: "Crush removed!"});
	});
};


exports.doCrush = function (req, res) {
	const userId		= req.connectedAs.id;
	const crushTarget	= req.params.id;
	var	  doubleCrush	= false;

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

				if (crushFound)
					return callback({swal: 'Crush already done'});

				var crush = new Crushs({
					from: userId,
					to: crushTarget,
					type: 'normal'
				});
				crush.save(function (err, crushSaved) {
					if (err)
						return callback(err);
					return callback();
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
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err});
		return res.status(200).json({message: "Crush done!", doubleCrush: doubleCrush});
	});
};
