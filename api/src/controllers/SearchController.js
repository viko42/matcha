var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Conversations		= mongoose.model('Conversations');
const thisController	= "SearchController";

exports.find = function (req, res) {
	const	userId		= req.connectedAs.id;
	let		results		= {};

	async.waterfall([
		function (callback) {
			Users.find({}).exec(function (err, usersFound) {
				if (err)
					return callback(err);

				if (!usersFound)
					return callback('Not user found');

				for (var i = 0; i < usersFound.length; i++) {
					usersFound[i] = {
						id: usersFound[i].id,
						firstName: usersFound[i].firstName,
						lastName: usersFound[i].lastName
					}
				}
				results = usersFound;
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "Crushed!", users: results});
	});
};
