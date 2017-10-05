import express from 'express'
import jwt from 'jsonwebtoken'
import { API_SECRET } from '../constants'
const router = express();
const ApiRoutes = express.Router();

router.set('jwtTokenSecret', API_SECRET);
ApiRoutes.use((req, res, next) => {
	const obj = req.body;
	const token = obj.token;

	if (!token)
		res.send({message: "Incorrect"});
	else {
		jwt.verify(token, router.get('jwtTokenSecret'), function(err, decoded) {
	         if (err) {
	           return res.json({ success: false, message: 'Failed to authenticate token.' });
	         } else {
	           req.decoded = decoded;
			   if (decoded.name !== "Victor")
			   		res.send("Mauvais utilisateur");
			   console.log(req.decoded)
	           next();
	         }
	       });
	}
});

export default ApiRoutes;
