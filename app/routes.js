import express from 'express';
import path from 'path';
import * as myURLS from '../myURLS';
const router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
	res.send("SALUT");
});

router.get('/about', myURLS.first);

router.get('/data', myURLS.contact);

router.get('/data/:id', myURLS.contactid);
