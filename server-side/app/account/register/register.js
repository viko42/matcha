const express = require('express');
const router = express();
import User from '../../../bdd/db.user'
import validator from 'validator'

router.post('/register', (req, res) => {
	const regObj = req.body
	var message = "OK"

	if (!regObj.name || !regObj.firstname|| !regObj.email || !regObj.pass || !regObj.passconfirm)
		message = "Champs manquant(s)"
	else if (regObj.pass != regObj.passconfirm)
		message = "Mots de passe non identique";
	else if (regObj.pass.length > 10 || regObj.pass.length < 4)
		message = "Mot de passe non valide";
	else if (!validator.isEmail(regObj.email))
		message = "Email non valide";

  const newUser = User({
    name: regObj.name,
    firstname: regObj.firstname,
    email: regObj.email,
    password: regObj.pass,
    activate: '0',
    admin: '0'
  });
	// User.find({}, function(err, users) {
	// if (err) throw err;
	// // object of all the users
	// console.log(users);
	// });
	if (message === "OK") {
	  newUser.save(function(err) {
	    if (err)
	      res.send({message: "Utilisateur deja existant", status: 0});
	    else
				res.send({message: "Utilisateur cree !", status: 1});
	  }).catch((err) => {
			res.send({message: "Impossible de creer l'utilisateur", status: 0});
		});
	}
	else
		res.send({message, status: 0});
});

export default router;
