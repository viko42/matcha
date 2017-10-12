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
	var		userEmit;
	var		receiverSocketId;

	const maxNotification = function (msg) { var rsp = ""; for (var i = 0; i < msg.length; i++) { rsp += msg[i]; if (i > 20) { rsp += '...'; break; } } return rsp; };
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
			Users.findOne({'_id': userId}).exec(function (err, userEmitFound) {
				if (err)
					return callback(err);

				if (!userEmitFound)
					return callback('Receiver not found');

				userEmit = userEmitFound.firstName;
				return callback();
			})
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
			socket.to(receiverSocketId).emit('test_message', {message: userEmit+" : "+ maxNotification(messageSent), status: 'success'});
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
