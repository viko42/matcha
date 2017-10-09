var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var moment		= require('moment');
var bcrypt		= require('bcrypt');
var Conversations	= mongoose.model('Conversations');
var Messages		= mongoose.model('Messages');

exports.inbox = function(req, res) {
	// const user = new Users(req.connectedAs);
	console.log('Calling INBOX');
	const userId			= req.connectedAs._id;
	var listConversations	= {};
	var listMessages		= [];
	// const listConversations = new Conversations({
	// 	sender: userId,
	// 	recipent: userId,
	// 	premium: false,
	// 	last_activity: "000-00",
	// 	messages: []
	// });
	// listConversations.save(function (err, result) {
	// 	console.log(err, result);
	// 	return res.status(200).json({inbox: [], created: 'ok' });
	// });

	var test = {};
	async.waterfall([
		function (callback) {
			Conversations.find({ $or:[ {'sender': userId}, {'recipent': userId} ]}).populate('sender').populate('recipent').exec(function (err, conversations) {
				if (err)
					return callback(err);
				listConversations = _.clone(conversations);
				return callback();
			});
		},
		function (callback) {
			async.forEachOf(listConversations, function (conversation, keyConv, next_conversation) {
				// console.log('key: ' + key);
				Messages.find({conversation: conversation.id}).exec(function (err, allMessages) {
					if (err)
						return next_conversation(err);

					// listConversations[keyConv].messages = [];
					for (key in allMessages) {
						// console.log(allMessages[key].sender);
						// console.log(userId);
						allMessages[key] = {
							content: allMessages[key].message,
							date: allMessages[key].created_at,
							sender: String(allMessages[key].sender) == String(userId) ? '1' : '0'
						}
					}
					listMessages.push({conversationId: conversation.id, messages: allMessages});
					return next_conversation();
				});
			}, function (err) {
				if (err)
					return callback(err);
				return callback();
			})
		},
		function (callback) {
			for (key in listConversations) {
				listConversations[key] = {
					sender: {
						email: listConversations[key].sender.email,
						firstName: listConversations[key].sender.firstName,
						lastName: listConversations[key].sender.lastName
					},
					recipent: {
						email: listConversations[key].recipent.email,
						firstName: listConversations[key].recipent.firstName,
						lastName: listConversations[key].recipent.lastName
					},
					firstName: String(userId) == listConversations[key].sender.id ? listConversations[key].recipent.firstName : listConversations[key].sender.firstName,
					lastName: String(userId) == listConversations[key].sender.id ? listConversations[key].recipent.lastName : listConversations[key].sender.lastName,
					premium: listConversations[key].premium,
					last_activity: listConversations[key].last_activity,
					messages: listMessages[key].messages,
					id: listConversations[key].id
				}
			}
			return callback();
		},
	], function (err) {
		if (err)
			return s.serverError(res, err);
		// console.log(listConversations);
		return res.status(200).json({inbox: listConversations });
	})
};

exports.send = function(req, res) {
	const	userId			= req.connectedAs._id;
	const	conversationId	= req.body.id;
	const	messageSent		= req.body.message;

	async.waterfall([

		// Search Conversation
		function (callback) {
			Conversations.findOne({'_id': conversationId}).exec(function (err, conversationFound) {
				if (err)
					return callback(err);

				if (!conversationFound)
					return callback('Conversation not Found');
				return callback();
			});
		},

		// push the message
		function (callback) {
			var new_message = new Messages({
				message: messageSent,
				sender: userId,
				conversation: conversationId,
				status: "sended",
				created_at: moment().format("DD/MM/YYYY HH:MM")
			});

			new_message.save(function (err, messageSaved) {
				if (err)
					return callback(err);
				console.log('Message sent!');
				return callback();
			})
		}
	], function (err) {
		if (err)
			return s.serverError(res, err);
		return res.status(200).json({sent: {} });
	})
};

exports.delete = function(req, res) {
	// const user = new Users(req.connectedAs);

	console.log(req.body);
	async.waterfall([
		function (callback) {
			return callback();
		},
	], function (err) {
		if (err)
			return s.serverError(res, err);
		console.log(req.connectedAs);
		return res.status(200).json({deleted: {} });
	})
};
