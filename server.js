import express from 'express';
import bodyParser from 'body-parser';
import * as myURLS from './myURLS';
var router = require('./app/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router)

app.listen(8080, () => console.log('server started'));
