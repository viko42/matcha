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
mongoose.connect('mongodb://'+process.env.IP+':'+process.env.MONGOPORT+'/matchadb', { useMongoClient: true }, function (err) {
	// if (err)
	// 	return res.status('504').json({'error': 'ok'});
	// console.log('Callback Mongoose');
	// console.log(err);
});

//#########################
//	 Authorization headers
//#########################

app.use(function(req, res, next) {

	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
	if (!mongoose.connection.readyState) {
		return res.status(503).json({message: "impossible de se connecter"});
	}
	next();
});

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(bodyParser.json());
app.use (function (error, req, res, next){
	if (res.req._parsedUrl.path)
		return res.status(403).json({'errors': {swal: "Votre image doit etre inferieur à 5mb"}});
    console.log("Une requete n'a pas abouti depuis: " + req.connection.remoteAddress);
});

//######################
//	 Init socket.io
//######################

io.use(function(socket, next) {
	if (!mongoose.connection.readyState)
		return next(new Error('Server error'));
	if (socket.handshake.query && socket.handshake.query.token){
		jwt.verify(socket.handshake.query.token, 'ilovescotchyscotch', function(err, decoded) {
			if (err) {
				return next();
			}
			socket.decoded = decoded;
			socket.handshake.query.userId = decoded.id;
			return next();
		});
	}
	// next(new Error('Server error'));
}).on("connection", sockets);

//######################
//	 Starting the App
//######################

routes(app);
server.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
