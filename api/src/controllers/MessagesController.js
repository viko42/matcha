var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var moment		= require('moment');
var bcrypt		= require('bcrypt');
var Conversations	= mongoose.model('Conversations');
var Notifications	= mongoose.model('Notifications');
var Messages		= mongoose.model('Messages');
var Users			= mongoose.model('Users');

const thisController	= "MessagesController";
const {isBlokedSocket}	= require('../policies/isBlocked');

const {addScore}		= require('../helpers/score');

exports.setAsRead	= function (data, socket) {
	Messages.update({status: 'sended', conversation: data.conversationId, sender: {"$ne": data.userId}}, {status: 'readed'}, {multi: true}, function(err, num) {
		if (!num || num.n <= 0)
			return ;
		Users.findOne({'_id': data.userId}).exec(function(err, userRead ) {
			if (err)
				return ;

			if (!userRead)
				return console.log('User not found');
		})
    });
};

exports.get_messages = function (data, socket, callback) {
	var messages	= [];
	var userId		= socket.handshake.query.userId;

	Conversations.findOne({'_id': data.conversationId}).populate('sender').populate('recipent').exec(function (err, conversationFound) {
		if (err || !conversationFound)
			return {errors: {swal: "Conversation not found"}}

		Messages.find({conversation: data.conversationId}).exec(function (err, messagesFound) {
			if (err)
				return {errors: "error db"};

			Messages.count({status: 'sended', conversation: data.conversationId,  sender: {"$ne": userId} }).exec(function (err, nbMessagesUnread) {
				if (err)
					console.log('Unable to get unread message from this conversation - ' + data.conversationId);

				for (var i = 0; i < messagesFound.length; i++) {
					messages.push({
						message: messagesFound[i].message,
						sender: String(messagesFound[i].sender) == String(userId) ? "1" : "0",
						created_at: messagesFound[i].created_at
					});
				}
				return callback({messages, conversationId: data.conversationId, unread: nbMessagesUnread});
			});
		})
	})
};

exports.inbox = function(req, res) {
	const userId			= req.connectedAs._id;

	var listConversations	= {};
	var listMessages		= [];
	var inbox	= [];

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

				if (!conversation.sender || !conversation.recipent)
					return next_conversation();
				Users.findOne({'_id': String(userId) == conversation.sender.id ? conversation.recipent.id : conversation.sender.id}).exec(function (err, userFound) {
					if (err)
						return next_conversation(err);

					Messages.count({status: 'sended', conversation: conversation.id,  sender: {"$ne": userId} }).exec(function (err, nbMessagesUnread) {
						if (err)
							return next_conversation(err);

						inbox.push({
							sender: {
								email: conversation.sender.email,
								firstName: conversation.sender.firstName,
								lastName: conversation.sender.lastName
							},
							recipent: {
								email: conversation.recipent.email,
								firstName: conversation.recipent.firstName,
								lastName: conversation.recipent.lastName
							},
							firstName: String(userId) == conversation.sender.id ? conversation.recipent.firstName : conversation.sender.firstName,
							lastName: String(userId) == conversation.sender.id ? conversation.recipent.lastName : conversation.sender.lastName,
							id_profile: String(userId) == conversation.sender.id ? conversation.recipent.id : conversation.sender.id,
							premium: conversation.premium,
							last_activity: conversation.last_activity,
							messages: [],
							unread: nbMessagesUnread,
							id: conversation.id,
							connected: userFound.data.status === 'online' ? true : false
						});
						next_conversation();
					})
				});
			}, function (err) {
				if (err)
					return callback(err);
				return callback();
			})
		},

	], function (err) {
		if (err)
			return s.serverError(res, err, thisController);
		return res.status(200).json({inbox: inbox });
	})
};

exports.send = function(data, socket) {
	const	userId			= data.userId;
	const	conversationId	= data.conversationId;
	const	messageSent		= data.message;
	var		userEmit;
	var		receiverSocketId;
	var		receiverId;

	const maxNotification = function (msg) { var rsp = ""; for (var i = 0; i < msg.length; i++) { rsp += msg[i]; if (i > 20) { rsp += '...'; break; } } return rsp; };

	async.waterfall([
		// Search Conversation
		function (callback) {
			Conversations.findOne({'_id': conversationId}).exec(function (err, conversationFound) {
				if (err)
					return callback(err);

				if (!conversationFound)
					return callback('Conversation not Found');

				receiverId = String(userId) == conversationFound.sender ? conversationFound.recipent : conversationFound.sender;
				return callback();
			});
		},

		function (callback) {
			Users.findOne({'_id': userId}).exec(function (err, userEmitFound) {
				if (err)
					return callback(err);

				if (!userEmitFound)
					return callback('Emit not found');

				userEmit = userEmitFound.firstName;
				return callback();
			})
		},

		function (callback) {
			Users.findOne({'_id': receiverId}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					console.log('Receiver not found');

				receiverSocketId = userFound.data.socketid;
				return callback();
			})
		},

		// push the message
		function (callback) {
			var new_message = new Messages({
				message: messageSent,
				sender: userId,
				conversation: conversationId,
				status: "sended",
				created_at: moment()
			});

			new_message.save(function (err, messageSaved) {
				if (err)
					return callback(err);
				return callback();
			})
		},

		// Create Notification
		function (callback) {
			var new_notification = new Notifications({
				from:		userId,
				to:			receiverId,
				type:		"message",
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
			return console.log(thisController, err);

		exports.get_messages({userId: socket.handshake.query.userId, ...data}, socket, function (data) {
			socket.emit('message sent', data);
			isBlokedSocket(socket.handshake.query.userId, receiverSocketId, function (to, idRecipent) {
				socket.to(to).emit('test_message', {message: userEmit+" : "+ maxNotification(messageSent), status: 'success'});
				socket.to(to).emit('receive message', {conversationId: conversationId});
				addScore(idRecipent, 1);
			});
		})
	})
};

exports.delete = function(req, res) {
	// const user = new Users(req.connectedAs);

	// console.log(req.body);
	async.waterfall([
		function (callback) {
			return callback();
		},
	], function (err) {
		if (err)
			return s.serverError(res, err, thisController);
		// console.log(req.connectedAs);
		return res.status(200).json({deleted: {} });
	})
};
