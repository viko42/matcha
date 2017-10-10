var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var moment		= require('moment');
var bcrypt		= require('bcrypt');
var Conversations	= mongoose.model('Conversations');
var Messages		= mongoose.model('Messages');
var Users			= mongoose.model('Users');

exports.setAsRead	= function (data, socket) {
	Messages.update({status: 'sended', conversation: data.conversationId, sender: {"$ne": data.userId}}, {status: 'readed'}, {multi: true}, function(err, num) {
		console.log('A conversation has been read');

		if (!num || num.n <= 0)
			return ;
		Users.findOne({'_id': data.userId}).exec(function(err, userRead ) {
			if (err)
				return ;

			console.log(num.n + ' messages lus par ' + userRead.email);
		})
    });
};

exports.get_messages = function (data, socket, callback) {
	var messages = [];

	Conversations.findOne({'_id': data.conversationId}).populate('sender').populate('recipent').exec(function (err, conversationFound) {
		if (err || !conversationFound)
			return {errors: {swal: "Conversation not found"}}

		// console.log('Conversation entre ' + conversationFound.sender.firstName + ' et ' + conversationFound.recipent.firstName);
		Messages.find({conversation: data.conversationId}).exec(function (err, messagesFound) {
			if (err)
				return {errors: "error db"};

			// console.log('Nombre de message entre eux: ' + messagesFound.length);
			for (var i = 0; i < messagesFound.length; i++) {
				messages.push({
					message: messagesFound[i].message,
					sender: String(messagesFound[i].sender) == String(socket.handshake.query.userId) ? "1" : "0",
					created_at: messagesFound[i].created_at
				});
			}
			return callback({messages, conversationId: data.conversationId});
		})
	})
};

exports.inbox = function(req, res) {
	console.log('Récuperation de la messagerie');
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
	var testConversations = [];
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
				// Messages.find({conversation: conversation.id}).exec(function (err, allMessages) {
				// 	if (err)
				// 		return next_conversation(err);
				//
				// 	// listConversations[keyConv].messages = [];
				// 	for (key in allMessages) {
				// 		allMessages[key] = {
				// 			message: allMessages[key].message,
				// 			created_at: allMessages[key].created_at,
				// 			sender: String(allMessages[key].sender) == String(userId) ? '1' : '0'
				// 		}
				// 	}
				// 	listMessages.push({conversationId: conversation.id, messages: allMessages});
				// 	return next_conversation();
				// });
				Messages.count({status: 'sended', conversation: conversation.id,  sender: {"$ne": userId} }).exec(function (err, nbMessagesUnread) {
					if (err)
						return next_conversation(err);
					testConversations.push({
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
						premium: conversation.premium,
						last_activity: conversation.last_activity,
						messages: [],
						unread: nbMessagesUnread,
						id: conversation.id
					});
					next_conversation();
				})
			}, function (err) {
				if (err)
					return callback(err);
				return callback();
			})
		},
		// function (callback) {
		// 	for (key in listConversations) {
		// 		listConversations[key] = {
		// 			sender: {
		// 				email: listConversations[key].sender.email,
		// 				firstName: listConversations[key].sender.firstName,
		// 				lastName: listConversations[key].sender.lastName
		// 			},
		// 			recipent: {
		// 				email: listConversations[key].recipent.email,
		// 				firstName: listConversations[key].recipent.firstName,
		// 				lastName: listConversations[key].recipent.lastName
		// 			},
		// 			firstName: String(userId) == listConversations[key].sender.id ? listConversations[key].recipent.firstName : listConversations[key].sender.firstName,
		// 			lastName: String(userId) == listConversations[key].sender.id ? listConversations[key].recipent.lastName : listConversations[key].sender.lastName,
		// 			premium: listConversations[key].premium,
		// 			last_activity: listConversations[key].last_activity,
		// 			// messages: listMessages[key].messages,
		// 			messages: [],
		// 			unread: 0,
		// 			id: listConversations[key].id
		// 		}
		// 	}
		// 	return callback();
		// },

	], function (err) {
		if (err)
			return s.serverError(res, err);
		return res.status(200).json({inbox: testConversations });
	})
};

exports.send = function(data, socket) {
	const	userId			= data.userId;
	const	conversationId	= data.conversationId;
	const	messageSent		= data.message;
	var		receiverSocketId;

	async.waterfall([

		// Search Conversation
		function (callback) {
			Conversations.findOne({'_id': conversationId}).exec(function (err, conversationFound) {
				if (err)
					return callback(err);

				if (!conversationFound)
					return callback('Conversation not Found');

				receiverSocketId = String(userId) == conversationFound.sender ? conversationFound.recipent : conversationFound.sender;
				return callback();
			});
		},

		function (callback) {
			Users.findOne({'_id': receiverSocketId}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('Receiver not found');

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
				created_at: moment().format("DD/MM/YYYY HH:MM")
			});

			new_message.save(function (err, messageSaved) {
				if (err)
					return callback(err);
				return callback();
			})
		}
	], function (err) {
		if (err)
			return console.log(err);

		exports.get_messages({userId: socket.handshake.query.userId, ...data}, socket, function (data) {
			socket.emit('message sent', data);
			socket.to(receiverSocketId).emit('receive message', {conversationId: conversationId});
		})
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
