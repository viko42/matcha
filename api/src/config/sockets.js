const mongoose				= require('mongoose');
const Users					= mongoose.model('Users');
const Messages				= require('../controllers/MessagesController');
const UsersController		= require('../controllers/UsersController');
const moment				= require('moment');

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
			console.log('User updated socket in DB!');
		});
	})

	socket.on('send message', function(data){
		Messages.send({userId: socket.handshake.query.userId, ...data}, socket);
  	});

	socket.on('send like', function(data){
		console.log('Send like');
		console.log(data);
  	});

	socket.on('send unlike', function(data){
		console.log('Send unlike');
		console.log(data);
	});

	socket.on('send visit', function(data){
		console.log('Send visit');
		console.log(data);
  	});

	socket.on('send crush', function(data){
		console.log('Send crush');
		console.log(data);
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
