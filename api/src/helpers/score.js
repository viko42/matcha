const mongoose	= require('mongoose');
const s			= require('../config/services');
const async		= require('async');
const _			= require('lodash');
const moment	= require('moment');
const Users		= mongoose.model('Users');
const Crushs	= mongoose.model('Crushs');
const thisHelper	= "scoreHelper";

exports.addScore = function (id, scoreToAdd) {
	Users.findOne({'_id': id}).exec(function (err, userFound) {
		if (err)
			return false;

		if (!userFound)
			return false;

		if (!userFound.data.score)
			userFound.data.score = 0;

		userFound.data.score += scoreToAdd;
		userFound = new Users(userFound);
		userFound.save(function (err, userSaved) {
			if (err)
				return false;
			return true;
		});
	});
};
