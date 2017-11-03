const mongoose	= require('mongoose');
const s			= require('../config/services');
const async		= require('async');
const _			= require('lodash');
const moment		= require('moment');
const Users			= mongoose.model('Users');
const thisController	= "MapsController";

exports.getPositions = function (req, res) {
	const	userId		= req.connectedAs.id;
	let		positions	= [];

	Users.find({}).exec(function (err, usersFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!usersFound)
			return s.notFound(res, {errors: "No users found"}, thisController);

		for (var i = 0; i < usersFound.length; i++) {
			positions[i] = {lat: usersFound[i].location[1], lng: usersFound[i].location[0]};
		}
		return res.status(200).json({positions});
	});
}
