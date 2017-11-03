module.exports = function (app) {
	var isConnected = require('../policies/isConnected');

	//####################################################################
	//						Users
	var Users = require('../controllers/UsersController');
	//--------------------------------------------------------------------

	app.route('/users')			.get(isConnected.authorization, Users.list);
	app.route('/users/tags')	.get(isConnected.authorization, Users.tags);

	app.route('/users/create')	.post(Users.create);
	app.route('/users/update')	.put(isConnected.authorization, Users.update);
	app.route('/users/delete')	.delete(isConnected.authorization, Users.delete);
	app.route('/users/block')	.post(isConnected.authorization, Users.block);

	app.route('/users/import')			.post(Users.import);
	app.route('/users/reset')			.post(Users.reset);
	app.route('/users/reset/password')	.post(Users.newPassword);

	//####################################################################
	//						Profile
	var Profile = require('../controllers/ProfileController');
	//--------------------------------------------------------------------

	app.route('/profile/:id')			.get(isConnected.authorization, Profile.getProfile);
	app.route('/profile/update')		.put(isConnected.authorization, Profile.updateProfile);
	app.route('/profile/upload')		.post(isConnected.authorization, Profile.uploadImage);
	app.route('/profile/avatar/delete')	.post(isConnected.authorization, Profile.deleteAvatar);
	app.route('/profile/avatar/change')	.post(isConnected.authorization, Profile.changeAvatar);

	app.route('/profile/avatar/find/')	.get(Profile.findAvatar);
	app.route('/profile/avatar/find/:id')	.get(Profile.findAvatar);


	//####################################################################
	//						Crushs
	var Crushs = require('../controllers/CrushsController');
	//--------------------------------------------------------------------

	app.route('/crushs')				.get(isConnected.authorization, Crushs.listCrush);
	app.route('/crushs/likes')			.get(isConnected.authorization, Crushs.listLikes);
	app.route('/crushs/:id')			.get(isConnected.authorization, Crushs.doCrush);
	app.route('/crushs/:id/remove')		.get(isConnected.authorization, Crushs.removeCrush);
	app.route('/crushs/:id/start')		.get(isConnected.authorization, Crushs.startConversation);

	//####################################################################
	//						Account
	var Account = require('../controllers/AccountController');
	//--------------------------------------------------------------------

	app.route('/account')						.get(isConnected.authorization, Account.informations);
	app.route('/account/update')				.put(isConnected.authorization, Account.update);
	app.route('/account/update/localization')	.put(isConnected.authorization, Account.updateLocalization);


	//####################################################################
	//						Messages
	var Messages = require('../controllers/MessagesController');
	//--------------------------------------------------------------------

	app.route('/inbox')						.get(isConnected.authorization, Messages.inbox);
	app.route('/inbox/send')				.post(isConnected.authorization, Messages.send);
	// app.route('/messages/delete')			.delete(isConnected.authorization, Messages.delete);

	//####################################################################
	//						Search
	var Search = require('../controllers/SearchController');
	//--------------------------------------------------------------------

	app.route('/find')					.post(isConnected.authorization, Search.find);
	app.route('/find/affinate')			.post(isConnected.authorization, Search.findAffinate);

	//####################################################################
	//						Search
	var Notifications = require('../controllers/NotificationsController');
	//--------------------------------------------------------------------

	app.route('/notifications')			.get(isConnected.authorization, Notifications.myNotifications);
	app.route('/notifications/read')	.get(isConnected.authorization, Notifications.setAsRead);


	//####################################################################
	//						Auth
	//--------------------------------------------------------------------

	app.route('/login')			.post(Users.login);

	//####################################################################
	//						Search
	var Visits = require('../controllers/VisitsController');
	//--------------------------------------------------------------------

	app.route('/visits')				.get(isConnected.authorization, Visits.listVisits);

	//####################################################################
	//						Report
	var Report = require('../controllers/ReportController');
	//--------------------------------------------------------------------

	app.route('/report')				.post(isConnected.authorization, Report.newReport);

};
