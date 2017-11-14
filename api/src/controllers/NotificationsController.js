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
const thisController	= "NotificationsController";

exports.setAsRead	= function (req, res) {
	const userId = req.connectedAs.id;

	Notifications.update({status: 'unread', to: userId}, {status: 'read'}, {multi: true}, function(err, num) {
		if (!num || num.n <= 0)
			return res.status(200).json({message: 'nothing to read'});

		Users.findOne({'_id': userId}).exec(function(err, userRead ) {
			if (err)
				return s.badRequest(res, err, thisController);
			return res.status(200).json({message: 'done'});
		});
    });
};

exports.myNotifications = function (req, res) {
	const	userId = req.connectedAs.id;
	var		notifications = [];
	var		unread = false;

	async.waterfall([
		function (callback) {
			Notifications.find({to: userId, status: "unread"}).populate('from').exec(function (err, unreadNotif) {
				if (err)
					return callback(err);

				if (unreadNotif[i] && !unreadNotif[i].from)
					return callback('User not found');

				for (var i = 0; i < unreadNotif.length; i++) {
					if (unreadNotif[i].type[0] === "message") {
						unreadNotif[i].message = "Vous avez reçu un message de " + unreadNotif[i].from.firstName;
						unreadNotif[i].link = "#/inbox";
					}
					if (unreadNotif[i].type[0] === "visit") {
						unreadNotif[i].message = "Vous avez reçu une visite de " + unreadNotif[i].from.firstName;
						unreadNotif[i].link = "#/visits";
					}
					if (unreadNotif[i].type[0] === "like") {
						unreadNotif[i].message = "Vous avez reçu un like de " + unreadNotif[i].from.firstName;
						unreadNotif[i].link = "#/likes";
					}
					if (unreadNotif[i].type[0] === "unlike") {
						unreadNotif[i].message = "Vous avez reçu un dislike de " + unreadNotif[i].from.firstName;
						unreadNotif[i].link = "#/likes";
					}
					if (unreadNotif[i].type[0] === "crush") {
						unreadNotif[i].message = "Vous avez reçu un crush de " + unreadNotif[i].from.firstName;
						unreadNotif[i].link = "#/crushs";
					}
					notifications.push({
						message: unreadNotif[i].message,
						type: unreadNotif[i].type[0],
						status: unreadNotif[i].status[0],
						link: unreadNotif[i].link
					});

					if (unread === false && unreadNotif[i].status[0] === "unread")
						unread = true;
				}
				return callback();
			});
		},
	], function (err) {
		if (err)
			return s.badRequest(res, err, thisController);

		return res.status(200).json({notifications: notifications, unread: unread});
	})
}
