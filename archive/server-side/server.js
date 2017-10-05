import express from 'express'
import bodyParser from 'body-parser'
import validator from 'validator'
import routes from './app/router/routes'
const cors = require('cors');

require('babel-register')({
   presets: [ 'es2015' ]
});
// mongoose.Promise = global.Promise;
// mongoose.Promise = require('bluebird');
// import es6Promise from 'es6-promise';
// mongoose.Promise = es6Promise.Promise;
// // mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://vlancien:qwqwqw@ds117889.mlab.com:17889/matcha42vlancien');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(require('./app/router/routes'));
app.get('/', routes);

app.listen(8080, () => {
	console.log('Server started');
});
