var mongoose			= require('mongoose');
var s					= require('../config/services');
var async				= require('async');
var _					= require('lodash');
var moment				= require('moment');
var Users				= mongoose.model('Users');
var Crushs				= mongoose.model('Crushs');
var Conversations		= mongoose.model('Conversations');
const thisController	= "SearchController";
const geolib			= require('geolib');

const filterList = [
	"",
	"Homme",
	"Femme",
	"Hétéro",
	"Gays",
	"Gay",
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

exports.findAffinate = function (req, res) {
	const	userId			= req.connectedAs.id;
	let		results			= {};
	let		filtersUsed		= {};
	let		tags			= req.body.tags;
	let		filters			= req.body.filters;
	let		user			= {};

	async.waterfall([
		function (callback) {
			Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback("User not found");

				if (!userFound.location)
					userFound.location = [0,0];

				user = userFound;
				return callback();
			});
		},
		//[Sexe/Orientation]
		function (callback) {
			if (user.data.profile.orientation === "Hétéro" && user.data.profile.sexe === "Homme") {
				filtersUsed["data.profile.sexe"] = "Femme";
				filtersUsed["data.profile.orientation"] = "Hétéro";
			}
			if (user.data.profile.orientation === "Hétéro" && user.data.profile.sexe === "Femme") {
				filtersUsed["data.profile.sexe"] = "Homme";
				filtersUsed["data.profile.orientation"] = "Hétéro";
			}

			if (user.data.profile.orientation === "Gays" && user.data.profile.sexe === "Femme") {
				filtersUsed["data.profile.sexe"] = "Femme";
				filtersUsed["data.profile.orientation"] = "Gays";
			}
			if (user.data.profile.orientation === "Gays" && user.data.profile.sexe === "Homme") {
				filtersUsed["data.profile.sexe"] = "Homme";
				filtersUsed["data.profile.orientation"] = "Gays";
			}

			if (user.data.profile.orientation === "Bisexuelle")
				console.log('Show uniquement de tout le monde');

			//User tags
			// Popularity users

			// Localization users
			// filtersUsed['location'] = {
			// 		$geoWithin: {
			// 			$centerSphere: [
			// 				[user.location[0], user.location[1]],
			// 				100 / 6378.1
			// 			]
			// 		}
			// };
			return callback();
		},

		// Check filters
		function (callback) {
			for (key in filters) {
				if (!filterList.indexOf(filters[key])) {
					return callback('Invalid filter');
				}
			}
			return callback();
		},

		function (callback) {
			if (filters.sexe)
				filtersUsed["data.profile.sexe"] = filters.sexe;

			if (filters.orien)
				filtersUsed["data.profile.orientation"] = filters.orien;

			if (filters.age && filterList.indexOf(filters.age) === 7)
				filtersUsed["birth"] = {$lt: moment().subtract('18', 'years').format(), $gt: moment().subtract('25', 'years').format() };

			if (filters.age && filterList.indexOf(filters.age) === 8)
				filtersUsed["birth"] = {$lt: moment().subtract('25', 'years').format(), $gt: moment().subtract('35', 'years').format() };

			if (filters.age && filterList.indexOf(filters.age) === 9)
				filtersUsed["birth"] = {$lt: moment().subtract('35', 'years').format(), $gt: moment().subtract('100', 'years').format() };

			var myPosition	= [user.location[0], user.location[1]];
			var radius		= false;

			if (filters.loca && filterList.indexOf(filters.loca) === 10)
				radius = 1;

			if (filters.loca && filterList.indexOf(filters.loca) === 11)
				radius = 5;

			if (filters.loca && filterList.indexOf(filters.loca) === 12)
				radius = 10;

			if (filters.loca && filterList.indexOf(filters.loca) === 13)
				radius = 25;

			if (filters.loca && filterList.indexOf(filters.loca) === 14)
				radius = 100;

			if (filters.loca && radius)
				filtersUsed['location'] = {
						$geoWithin: {
							$centerSphere: [
								myPosition,
								radius / 6378.1
							]
						}
				};

			if (tags && tags.length > 0)
				filtersUsed['data.profile.tags'] = { "$in" : tags };

			return callback();
		},

		function (callback) {
			Users.find(filtersUsed).sort({'data.score': -1}).exec(function (err, usersFound) {
				if (err)
					return callback(err);

				if (!usersFound)
					return callback('Not user found');

				for (var i = 0; i < usersFound.length; i++) {
					var isAvatar = true;

					if (!usersFound[i] || !usersFound[i].data.pictures || (!usersFound[i].data.avatarID && !usersFound[i].data.pictures[0]))
						isAvatar = false;

					if (!usersFound[i].data.avatarID || !usersFound[i].data.pictures[usersFound[i].data.avatarID])
						usersFound[i].data.avatarID = 0;

					usersFound[i] = {
						id: usersFound[i].id,
						firstName: usersFound[i].firstName,
						lastName: usersFound[i].lastName,
						age: moment().diff(usersFound[i].birth, 'years'),
						src: (!isAvatar || !usersFound[i].data.pictures[usersFound[i].data.avatarID]) ? "http://www.bmxpugetville.fr/wp-content/uploads/2015/09/avatar.jpg" : usersFound[i].data.pictures[usersFound[i].data.avatarID].data,
						score: usersFound[i].data.score ? usersFound[i].data.score : 0,
						tags: usersFound[i].data.profile.tags ? usersFound[i].data.profile.tags : [],
						distance: geolib.getDistance( {latitude: user.location[1], longitude: user.location[0]}, {latitude: usersFound[i].location[1], longitude: usersFound[i].location[0]} )
					}
				}
				results = usersFound;
				return callback();
			});
		},
		function (callback) {
			_.remove(results, { id: req.connectedAs.id });

			for (var i = 0; i < user.blocked.length; i++) {
				_.remove(results, { id: user.blocked[i] });
			}
			return callback();
		},
		// Sort Localization
		function (callback) {
			results = _.sortBy(results, ["score", "distance"]).reverse();
			return callback();
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({users: results});
	});
};


exports.find = function (req, res) {
	const	userId			= req.connectedAs.id;
	let		blockedUsers	= [];
	let		results			= {};
	let		filtersUsed		= {};
	let		filters			= req.body.filters;
	let		tags			= req.body.tags;
	let		user			= {};

	async.waterfall([
		function (callback) {
			for (key in filters) {
				if (!filterList.indexOf(filters[key])) {
					return callback('Invalid filter');
				}
			}
			return callback();
		},
		function (callback) {
			Users.findOne({'_id': req.connectedAs.id}).exec(function (err, userFound) {
				if (err)
					return callback(err);

				if (!userFound)
					return callback("User not found");

				if (!userFound.location)
					userFound.location = [0,0];

				user = userFound;
				return callback();
			});
		},
		function (callback) {
			if (filters.sexe)
				filtersUsed["data.profile.sexe"] = filters.sexe;

			if (filters.orien)
				filtersUsed["data.profile.orientation"] = filters.orien;

			if (filters.age && filterList.indexOf(filters.age) === 7)
				filtersUsed["birth"] = {$lt: moment().subtract('18', 'years').format(), $gt: moment().subtract('25', 'years').format() };

			if (filters.age && filterList.indexOf(filters.age) === 8)
				filtersUsed["birth"] = {$lt: moment().subtract('25', 'years').format(), $gt: moment().subtract('35', 'years').format() };

			if (filters.age && filterList.indexOf(filters.age) === 9)
				filtersUsed["birth"] = {$lt: moment().subtract('35', 'years').format(), $gt: moment().subtract('100', 'years').format() };

			var myPosition	= [user.location[0], user.location[1]];
			var radius		= false;

			if (filters.loca && filterList.indexOf(filters.loca) === 10)
				radius = 1;

			if (filters.loca && filterList.indexOf(filters.loca) === 11)
				radius = 10;

			if (filters.loca && filterList.indexOf(filters.loca) === 12)
				radius = 25;

			if (filters.loca && filterList.indexOf(filters.loca) === 13)
				radius = 100;

			if (filters.loca && radius)
				filtersUsed['location'] = {
						$geoWithin: {
							$centerSphere: [
								myPosition,
								radius / 6378.1
							]
						}
				};

			if (tags && tags.length > 0) {
				filtersUsed['data.profile.tags'] = { "$in" : tags };
			}

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
					var isAvatar = true;

					if (!usersFound[i] || !usersFound[i].data.pictures || (!usersFound[i].data.avatarID && !usersFound[i].data.pictures[0]))
						isAvatar = false;

					if (!usersFound[i].data.avatarID || !usersFound[i].data.pictures[usersFound[i].data.avatarID])
						usersFound[i].data.avatarID = 0;

					usersFound[i] = {
						id: usersFound[i].id,
						firstName: usersFound[i].firstName,
						lastName: usersFound[i].lastName,
						age: moment().diff(usersFound[i].birth, 'years'),
						src: (!isAvatar || !usersFound[i].data.pictures[usersFound[i].data.avatarID]) ? "http://www.bmxpugetville.fr/wp-content/uploads/2015/09/avatar.jpg" : usersFound[i].data.pictures[usersFound[i].data.avatarID].data,
						score: usersFound[i].data.score ? usersFound[i].data.score : 0,
						tags: usersFound[i].data.profile.tags ? usersFound[i].data.profile.tags : [],
						distance: geolib.getDistance( {latitude: user.location[1], longitude: user.location[0]}, {latitude: usersFound[i].location[1], longitude: usersFound[i].location[0]} )
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
