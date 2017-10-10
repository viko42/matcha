const mongoose		= require('mongoose');
const Users			= mongoose.model('Users');
const Messages		= require('../controllers/MessagesController');

exports.sockets = function (socket) {
	console.log("New client connected")
	// console.log(socket.handshake.query.userId);
	Users.findOne({"_id": socket.handshake.query.userId}).exec(function (err, userFound) {
		if (err || !userFound)
			return ;

		var updateUser = new Users(userFound);
		updateUser.data.socketid = socket.id;
		updateUser.save(function (err, userSaved) {
			if (err)
				return ;
			console.log('User updated socket in DB!');
		});
	})

	socket.on('send message', function(data){
		console.log('Send Message');
		console.log(data);
		Messages.send({userId: socket.handshake.query.userId, ...data}, socket);
  	});
	// socket.on('received message', function(data){
	// 	console.log('received Message');
	// 	console.log(data);
	//
 //  	});
	socket.on('test', function (msg) {
		console.log('TEST --- ');
		console.log(msg);

		Users.findOne({'email': 'tam@live.fr'}, function (err, us) {
			socket.to(us.data.socketid).emit('emitDuServeur', msg);
			// socket.emit('emitDuServeur', {msg: "EN DIRECT DU SERVEUR"});
			console.log('Sent to ' + us.data.socketid);
		});
	});
	socket.on("disconnect", function () {
		Users.findOne({"_id": socket.handshake.query.userId}).exec(function (err, userFound) {
			if (err || !userFound)
				return ;

			var updateUser = new Users(userFound);
			updateUser.data.socketid = 'not connected';
			updateUser.save(function (err, userSaved) {
				if (err)
					return ;
				console.log('User removed socket in DB!');
			});
		})
	});
}
