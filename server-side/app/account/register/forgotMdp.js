const express = require('express');
const router = express();
const nodemailer = require('nodemailer');

// const connect = mongoose.connect('mongodb://vlancien:qwqwqw@ds117889.mlab.com:17889/matcha42vlancien');
// autoIncrement.initialize(connect);

import RCode from '../../../bdd/db.resetCode'

function send_new_password(email, call) {
	const code = Math.floor((Math.random() * 99999) + 10000);
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'matchavlancien@gmail.com',
			pass: 'matchavlancien42'
		}
	});
	let mailOptions = {
		from: '"Matcha 42" <Matcha@42.fr>',
			to: email,
			subject: 'Code de reinitialisation',
			text: 'Le code pour reset votre mot de passe est le suivant: '+ code + '.',
			html: '<b>Le code pour reset votre mot de passe est le suivant: '+ code + '.</b>'
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return (console.log(error))
			}
			console.log("Message sent !");
		});
		const newCode = new RCode({
			email: email,
			RCode: code
		});

		RCode.findOne({email: email}, function (err, user) {
			if (!err && user) {
				user.RCode = code;
				user.save(function(err) {
					if (err)
					throw err;
					console.log("RCode Updated !")
				})
			}
			else {
				newCode.save(function(err) {
					if (err)
					console.log("Can't save RCode.");
					else
					console.log("RCode saved !");
				})
			}
		});
		return call(console.log("New password for -> " + email));
}

router.post('/forgot', (req, res) => {
	const data = req.body,
	email = data.email;
	if (!email)
	res.send("NOT OK");
	send_new_password(email, function() {
		res.send({x: "want to reset mdp from " +email, message: 'successfully sent ', status: 1});
	});
});

module.exports = router;

// matchavlancien@gmail.com
