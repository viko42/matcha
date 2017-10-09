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
mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./src/models").forEach(function(file) {
  require("./src/models/" + file);
});

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

io.on("connection", function (socket) {
	// if (socket && socket.server && socket.server.eio && socket.server.eio.clientsCount ) {
	// 	console.log(socket.server.eio.clientsCount);
	// }
	console.log("New client connected"),
	setInterval(() => getApiAndEmit(socket), 10000);
	socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://randomuser.me/api"
    );
	console.log(res.data.results[0].name);
    socket.emit("FromAPI", {tmp: res.data.results[0].name.first});
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

routes(app);
server.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
