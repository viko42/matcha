const express = require('express');
const router = express();
const nodemailer = require('nodemailer');

// const connect = mongoose.connect('mongodb://vlancien:qwqwqw@ds117889.mlab.com:17889/matcha42vlancien');
// autoIncrement.initialize(connect);

import RCode from '../../../bdd/db.resetCode'
import Users from '../../../bdd/db.user'

const verify_rcode = (obj, callback) => {
	RCode.findOne({email: obj.email}, function (err, user) {
		if (!err && user) {
			if (user.RCode == obj.code)
				return callback(true);
		}
		return callback(false);
	});
}
const delete_RCode = (email) => {
	RCode.findOne({email}, function (err, user) {
		if (!err && user) { user.remove(function(err) { if (err) throw err })}
	});
}
const update_newpw = (obj) => {
	Users.findOne({ email: obj.email }, function (err, user) {
		if (!err && user) {
			user.password = obj.newpw
			user.save(function(err) {
				if (err)
					throw err
			});
			delete_RCode(obj.email);
			return (true)
		}
		else
			return (false)
	});
}

const verify_newpw = (obj) => {
	if (obj.newpw == obj.newpwb) {
		update_newpw(obj);
		return (true);
	}
	return (false);
}
router.post('/forgot/new', (req, res) => {
	const Obj = { email: req.body.email,
		code: req.body.code,
		newpw: req.body.newpass,
		newpwb: req.body.newpassbis }

	if (!Obj.email || !Obj.code || !Obj.newpw || !Obj.newpwb || Obj.newpwb !== Obj.newpw)
		return res.send({ message: "Champs incomplet(s)", status: 0 });
	else {
		verify_rcode(Obj, function(ret) {
			if (ret === true && verify_newpw(Obj) === true)
				return res.send({message: "Mise a jour du mot de passe", status: 1});
			else
				return res.send({message: "Informations incorrect", status: 0});
		});
	}
});

module.exports = router;
