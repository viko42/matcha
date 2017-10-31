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
var Reported		= mongoose.model('Reported');
var thisController	= "ReportedController";

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
			return s.serverError(res, err, thisController);

		if (!userFound)
			return s.notFound(res, {errors: profileId + ' not found. [Reported-CONTROLLER]'}, thisController);

		Reported.find({from: userId, reportedId: profileId}).exec(function(err, reportFound) {
			if (err)
				return s.serverError(res, err, thisController);

			if (reportFound)
				return s.notFound(res, {errors: {swal: 'Profile deja report'}}, thisController);

			new_report.save(function (err, reportSaved) {
				if (err)
					return s.serverError(res, err, thisController);
				// Score -20
				return res.status(200).json({reported: true});
			});
		});
	});
}
