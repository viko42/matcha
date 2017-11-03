const mongoose				= require('mongoose');
const Users					= mongoose.model('Users');
const Messages				= require('../controllers/MessagesController');
const UsersController		= require('../controllers/UsersController');
const VisitsController		= require('../controllers/VisitsController');
const CrushsController		= require('../controllers/CrushsController');
const moment				= require('moment');
const {isBlokedSocket}		= require('../policies/isBlocked');

exports.sockets = function (socket) {
	if (socket.handshake.query.userId === 'guest')
		// return console.log('New Guest connected');

	Users.findOne({"_id": socket.handshake.query.userId}).exec(function (err, userFound) {
		if (err || !userFound)
			return ;

		var updateUser = new Users(userFound);
		updateUser.data.socketid	= socket.id;

		updateUser.data.status		= 'online';
		updateUser.save(function (err, userSaved) {
			if (err)
				return ;
		});
	})

	socket.on('send message', function(data){
		Messages.send({userId: socket.handshake.query.userId, ...data}, socket);
  	});

	socket.on('send like', function(data){
		CrushsController.getSocketIdTarget({userId: socket.handshake.query.userId, ...data}, socket, function (err, socketId) {
			if (err)
				return ;
			isBlokedSocket(socket.handshake.query.userId, socketId, function (to) {
				socket.to(to).emit('receive like', {});
			})
		});
  	});

	socket.on('send unlike', function(data){
		CrushsController.getSocketIdTarget({userId: socket.handshake.query.userId, ...data}, socket, function (err, socketId) {
			if (err)
				return ;
			isBlokedSocket(socket.handshake.query.userId, socketId, function (to) {
				socket.to(to).emit('receive unlike', {});
			});
		});
	});

	socket.on('send crush', function(data){
		CrushsController.getSocketIdTarget({userId: socket.handshake.query.userId, ...data}, socket, function (err, socketId) {
			if (err)
				return ;

			isBlokedSocket(socket.handshake.query.userId, socketId, function (to) {
				socket.to(to).emit('receive crush', {});
			});
		});
	});

	socket.on('send visit', function(data){
		VisitsController.newVisit({userId: socket.handshake.query.userId, ...data}, socket, function (err, socketId) {
			if (err)
				return ;

			isBlokedSocket(socket.handshake.query.userId, socketId, function (to) {
				socket.to(to).emit('profile visited', {});
			});
		});
  	});

	socket.on('give messages from conversation', function (data) {
		Messages.get_messages({userId: socket.handshake.query.userId, conversationId: data.id}, socket, function (messages) {
			if (data.unread === false) {
				Messages.setAsRead({userId: socket.handshake.query.userId, conversationId: data.id}, socket);
				messages.unread = 0;
			}
			socket.emit('give messages from conversation', messages);
		})
	});
	socket.on('logout', function (data) {
		UsersController.logout(socket);
	});
	socket.on("disconnect", function () {
		UsersController.logout(socket);
	});
}
