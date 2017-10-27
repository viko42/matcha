var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Conversations		= mongoose.model('Conversations');
const thisController	= "SearchController";

const filterList = [
	"",
	"Homme",
	"Femme",
	"Hétéro",
	"Lesbienne",
	"Bisexuelle",
	"18 à 25",
	"25 à 35",
	"35 et plus",
	"Moins de 1km",
	"Moins de 5km",
	"Moins de 10km",
	"Moins de 25km",
	"Moins de 100km"
];

exports.find = function (req, res) {
	const	userId			= req.connectedAs.id;
	let		blockedUsers	= [];
	let		results			= {};
	let		filtersUsed		= {};
	let		filters			= req.body.filters;

	async.waterfall([
		function (callback) {
			for (key in filters) {
				console.log(key);
				if (!filterList.indexOf(filters[key])) {
					return callback('Invalid filter');
				}
			}
			return callback();
		},
		function (callback) {
			// if (filters.sexe)
			// 	filtersUsed["data.profile.sexe"] = filters.sexe;
			//
			// if (filters.orien)
			// 	filtersUsed["data.profile.orientation"] = filters.orien;

			filtersUsed = {
				data: {
					profile: {
						sexe: filters.sexe,
						orientation: filters.orien,
					}
				}
			};
			console.log(filtersUsed);
			return callback();
		},
		function (callback) {
			Users.findOne({'_id': userId}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback('User not found');

				blockedUsers = userFound.blocked;
				return callback();
			});
		},
		function (callback) {
			Users.find(filtersUsed).exec(function (err, usersFound) {
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
		function (callback) {
			_.remove(results, { id: req.connectedAs.id });

			for (var i = 0; i < blockedUsers.length; i++) {
				_.remove(results, { id: blockedUsers[i] });
			}
			return callback();
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "Crushed!", users: results});
	});
};
