const mongoose		= require('mongoose');
const Users			= mongoose.model('Users');
const Messages		= require('../controllers/MessagesController');
const moment		= require('moment');

exports.sockets = function (socket) {
	if (socket.handshake.query.userId === 'guest')
		return console.log('New Guest connected');
	console.log("New client connected")
	// console.log(socket.handshake.query.userId);
	Users.findOne({"_id": socket.handshake.query.userId}).exec(function (err, userFound) {
		if (err || !userFound)
			return ;

		var updateUser = new Users(userFound);
		updateUser.data.socketid	= socket.id;
		updateUser.data.status		= 'online';
		updateUser.save(function (err, userSaved) {
			if (err)
				return ;
			// console.log('User updated socket in DB!');
		});
	})

	socket.on('send message', function(data){
		console.log('Send Message');
		Messages.send({userId: socket.handshake.query.userId, ...data}, socket);
  	});

	socket.on('give messages from conversation', function (data) {
		console.log('give messages from conversation');
		Messages.get_messages({userId: socket.handshake.query.userId, conversationId: data.id}, socket, function (messages) {
			if (data.unread === false) {
				Messages.setAsRead({userId: socket.handshake.query.userId, conversationId: data.id}, socket);
				messages.unread = 0;
			}
			socket.emit('give messages from conversation', messages);
		})
	});
	socket.on("disconnect", function () {
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
				console.log('User removed socket in DB!');
			});
		})
	});
}
