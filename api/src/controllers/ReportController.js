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
const Reported		= mongoose.model('Reported');
const thisController	= "ReportedController";

const {addScore}		= require('../helpers/score');

exports.newReport = function (req, res) {
	const	userId		= req.connectedAs.id;
	const	profileId	= req.body.reportedId;

	if (!profileId || profileId === 'me' || profileId === userId)
		return s.notFound(res, {errors: 'Missing argument'}, thisController);


	const new_report = new Reported({
		from:		userId,
		reportedId:	profileId,
		date:		new Date()
	});

	Users.findOne({'_id': profileId}).exec(function (err, userFound) {
		if (err)
			return s.badRequest(res, err, thisController);

		if (!userFound)
			return s.notFound(res, {errors: profileId + ' not found. [Reported-CONTROLLER]'}, thisController);

		Reported.find({from: userId, reportedId: profileId}).exec(function(err, reportFound) {
			if (err)
				return s.badRequest(res, err, thisController);

			if (reportFound.length > 0)
				return s.notFound(res, {errors: {swal: 'Profile deja report'}}, thisController);

			new_report.save(function (err, reportSaved) {
				if (err)
					return s.badRequest(res, err, thisController);
				addScore(profileId, -10);
				return res.status(200).json({reported: true});
			});
		});
	});
}
