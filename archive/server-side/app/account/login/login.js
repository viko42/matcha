import { API_SECRET } from '../../constants'
const express = require('express');
const router = express();
import jwt from 'jsonwebtoken'
import Users from '../../../bdd/db.user'


router.set('jwtTokenSecret', API_SECRET);

router.post('/login', async (req, res) => {
	const obj = req.body;

	if (!obj.email || !obj.pass) {
		res.send({message: "Incorrect"});
		return ;
	}
	let userReg = {}
	let message;
	let status = false
	await Users.find({email: obj.email}, function(err, user) {
		if (err) throw err;

		if (user[0] && typeof user[0].password !== 'undefined' && user[0].password === obj.pass) {
			userReg.id = user[0]._id
			message = "Vous etes bien connecte."
			status = true;
			const token = jwt.sign(userReg, router.get('jwtTokenSecret'), {
				expiresIn: "2 days"
			})
			userReg.token = token
		}
		else {
			message = "Mauvais mot de passe";
		}
	});
	res.json({
		message,
		userReg,
		status
	});
});

export default router;
