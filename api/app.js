var express		= require("express");
var app			= express();
var port		= process.env.PORT || 8080;
var moment		= require('moment');
var mongoose	= require('mongoose');
var cors		= require('cors');
mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./src/models").forEach(function(file) {
  require("./src/models/" + file);
});


var bodyParser	= require('body-parser');
var routes		= require('./src/config/routes');

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

routes(app);
app.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
