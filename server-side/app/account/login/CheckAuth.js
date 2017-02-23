import { API_SECRET } from '../../constants'
const express = require('express');
const router = express();
import jwt from 'jsonwebtoken'
import Users from '../../../bdd/db.user'

router.set('jwtTokenSecret', API_SECRET);

router.post('/auth', async function(req, res) {
	const obj = req.body;

	if (!obj.id || !obj.token) {
		console.log(obj)
		res.send({message: "Requete Incorrect", status: false});
		return ;
	}
	console.log("Demande d'authentification pour");
	let UserTrack;

	function inTouch(obj) {
		res.send(obj);
	}
	await Users.find({_id: obj.id}, function(err, User) {
		if (!err) {
			UserTrack = User[0];
			inTouch({UserTrack, status: true});
		}
	}).catch(() => {
		inTouch({ message: "User not found", status: false});
	});
})

export default router;
