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

mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./src/models").forEach(function(file) {
  require("./src/models/" + file);
});

const {sockets}		= require('./src/config/sockets');

const bodyParser	= require('body-parser');
const routes		= require('./src/config/routes');

//######################
//	 Connecting to DB
//######################

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/matchadb', { useMongoClient: true });

//#########################
//	 Authorization headers
//#########################

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

io.use(function(socket, next) {
	if (socket.handshake.query && socket.handshake.query.token){
		jwt.verify(socket.handshake.query.token, 'ilovescotchyscotch', function(err, decoded) {
			if (err) return next(new Error('Authentication error'));
			socket.decoded = decoded;
			socket.handshake.query.userId = decoded.id;
			next();
		});
	}
	next(new Error('Authentication error'));
}).on("connection", sockets);

//######################
//	 Starting the App
//######################

routes(app);
server.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
