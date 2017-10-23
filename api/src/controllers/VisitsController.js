var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var moment		= require('moment');
var bcrypt		= require('bcrypt');
var Conversations	= mongoose.model('Conversations');
var Notifications	= mongoose.model('Notifications');
var Messages		= mongoose.model('Messages');
var Users			= mongoose.model('Users');
var Visits			= mongoose.model('Visits');
var thisController	= "VisitsController";
const {isBlocked}	= require('../policies/isBlocked');

exports.listVisits		= function (req, res) {
	const userId		= req.connectedAs.id;

	var visitors = [];

	async.waterfall([
		function (callback) {
			Visits.find({profile: userId}).populate('visitor').exec(function (err, visitorsFound) {
				if (err)
					return callback(err);

				async.forEachOf(visitorsFound, function (visit, keyVisitor, next_visitor) {
					if (visit.visitor.id !== userId)
						visitors.push({firstName: visit.visitor.firstName, lastName: visit.visitor.lastName, profileId: visit.visitor.id, date: moment(visit.date).format('DD/MM HH:mm')})
					next_visitor();
				}, function (err) {
					if (err)
						return callback(err);
					return callback();
				});
			});
		},
	], function (err) {
		if (err)
			return s.notFound(res, {errors: err}, thisController);
		return res.status(200).json({message: "List Visitors!", visitors: visitors});
	});
};

exports.newVisit = function (data, socket, callback) {
	const	visitor = data.userId;
	const	profileId = data.id;

	if (profileId === 'me')
		return callback();

	const new_visit = new Visits({
		visitor: visitor,
		profile: profileId,
		date: new Date()
	});

	Users.findOne({'_id': profileId}).exec(function (err, userFound) {
		if (err)
			return callback(err);

		if (!userFound)
			return callback(profileId + ' not found. [VISITS-CONTROLLER]');

		isBlocked(visitor, profileId, function (isBlocked) {
			if (isBlocked)
				return callback('User is blocked - No notification [VISITS]');

			new_visit.save(function (err, visitSaved) {
				if (err)
					return callback(err);
				return callback(null, userFound.data.socketid);
			});
		})
	});
}
