const mongoose	= require('mongoose');
const s			= require('../config/services');
const async		= require('async');
const _			= require('lodash');
const moment		= require('moment');
const bcrypt		= require('bcrypt');
const Conversations	= mongoose.model('Conversations');
const Notifications	= mongoose.model('Notifications');
const Messages		= mongoose.model('Messages');
const Users			= mongoose.model('Users');
const Visits			= mongoose.model('Visits');
const thisController	= "VisitsController";

const {isBlocked}	= require('../policies/isBlocked');
const {addScore}		= require('../helpers/score');

exports.listVisits		= function (req, res) {
	const userId		= req.connectedAs.id;

	var visitors = [];

	async.waterfall([
		function (callback) {
			Visits.find({profile: userId}).populate('visitor').exec(function (err, visitorsFound) {
				if (err)
					return callback(err);

				async.forEachOf(visitorsFound, function (visit, keyVisitor, next_visitor) {
					if (visit && visit.visitor && visit.visitor.id !== userId)
						visitors.push({firstName: visit.visitor.firstName, lastName: visit.visitor.lastName, profileId: visit.visitor.id, date: moment(visit.date).format('DD/MM HH:mm'), age: moment().diff(visit.visitor.birth, 'years')})
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

	var new_notification = new Notifications({
		from:		visitor,
		to:			profileId,
		type:		"visit",
		status:		"unread",
		created_at: new Date()
	});

	Users.findOne({'_id': profileId}).exec(function (err, userFound) {
		if (err)
			return callback(err);

		if (!userFound)
			return callback(profileId + ' not found. [VISITS-CONTROLLER]');

		new_notification.save(function (err, notifSaved) {
			isBlocked(visitor, profileId, function (isBlocked) {
				if (isBlocked)
					return callback('User is blocked - No notification [VISITS]');

				new_visit.save(function (err, visitSaved) {
					if (err)
						return callback(err);
					// Score +5
					addScore(profileId, 5);
					return callback(null, userFound.data.socketid);
				});
			})
		});
	});
}
