var express		= require("express");
var app			= express();
var port		= process.env.PORT || 8080;
var moment		= require('moment');
var mongoose	= require('mongoose');
mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./api/models").forEach(function(file) {
  require("./api/models/" + file);
});

var bodyParser	= require('body-parser');
var routes		= require('./api/config/routes');

//######################
//	 Connecting to DB
//######################

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/matchadb', { useMongoClient: true });

//######################
//	 Starting the App
//######################

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);
app.listen(port);

console.log('\x1Bc');
console.log("\
############################################\n\
#                                          #\n\
#         App started "+port+"                 #\n\
#                " + moment().format('HH:mm:ss') + "                  #\n\
############################################");
