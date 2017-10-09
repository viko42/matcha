const express		= require("express");
const app			= express();
const port			= process.env.PORT || 8080;

const moment		= require('moment');
const mongoose		= require('mongoose');
const cors			= require('cors');

const socketIo		= require("socket.io");
const axios			= require("axios");
const http			= require("http");
const server		= http.createServer(app);
const io			= socketIo(server);

const jwt			= require('jsonwebtoken');
/// const myController	= require('./src/controllers/MessagesController');
mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./src/models").forEach(function(file) {
  require("./src/models/" + file);
});

const Users			= mongoose.model('Users');

const bodyParser	= require('body-parser');
const routes		= require('./src/config/routes');

//######################
//	 Connecting to DB
//######################

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/matchadb', { useMongoClient: true });

//######################
//	 Starting the App
//######################

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//######################
//	 Init socket.io
//######################


io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, 'ilovescotchyscotch', function(err, decoded) {
      if(err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
	  socket.handshake.query.userId = decoded.id;
	  next();
    });
  }
  next(new Error('Authentication error'));
}).on("connection", function (socket) {
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

	// console.log(socket.request.headers);
	// setInterval(() => getApiAndEmit(socket), 10000);
	socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
  	});
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
});

// const getApiAndEmit = async socket => {
//   try {
//     const res = await axios.get("http://localhost:8080/inbox");
// 	// console.log(res.data.inbox);
//     socket.emit("Inbox", {inbox: res.data.inbox});
//
//   } catch (error) {
//     console.error(`Error: ${error.code}`);
//   }
// };

routes(app);
server.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
