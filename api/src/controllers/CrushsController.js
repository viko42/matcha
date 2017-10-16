var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Conversations		= mongoose.model('Conversations');


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
			Conversations.findOne({$or: [ {sender: userId, recipent: crushTarget}, {recipent: userId, sender: crushTarget}]}).exec(function (err, convFound) {
				if (err)
					return callback();

				if (convFound)
					return callback('Conversation already started');
				return callback();
			})
		},
		function (callback) {
			var new_conv = new Conversations({
				sender: userId,
				recipent: crushTarget,
				premium: false,
			});
			new_conv.save(function (err, convSaved) {
				if (err)
					return callback(err);
				return callback();
			});
		}
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
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err});
		return res.status(200).json({message: "Crush removed!"});
	});
};


exports.doCrush = function (req, res) {
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
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err});
		return res.status(200).json({message: "Crushed!"});
	});
};
