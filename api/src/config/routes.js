module.exports = function (app) {
	var isConnected = require('../policies/isConnected');

	//####################################################################
	//						Users
	var Users = require('../controllers/UsersController');
	//--------------------------------------------------------------------

	app.route('/users')			.get(isConnected.authorization, Users.list);
	app.route('/users/create')	.post(Users.create);
	app.route('/users/update')	.put(isConnected.authorization, Users.update);
	app.route('/users/delete')	.delete(isConnected.authorization, Users.delete);
	app.route('/users/block')	.post(isConnected.authorization, Users.block);
	app.route('/users/report')	.post(isConnected.authorization, Users.report);

	//####################################################################
	//						Profile
	var Profile = require('../controllers/ProfileController');
	//--------------------------------------------------------------------

	app.route('/profile/:id')			.get(isConnected.authorization, Profile.getProfile);
	app.route('/profile/update')		.put(isConnected.authorization, Profile.updateProfile);
	app.route('/profile/upload')		.post(isConnected.authorization, Profile.uploadImage);
	app.route('/profile/avatar/delete')	.post(isConnected.authorization, Profile.deleteAvatar);
	app.route('/profile/avatar/change')	.post(isConnected.authorization, Profile.changeAvatar);

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

	//
	// //
	// const multer		= require('multer');
	// const storage = multer.diskStorage({
	//   destination: './files',
	//   filename(req, file, cb) {
	//     cb(null, `${new Date()}-${file.originalname}`);
	//   },
	// });
	// const upload = multer({ storage });
	// //
	//
	// app.route('/profile/upload').post(function (req, res) {
	// 	const file = req.file; // file passed from client
	//     const meta = req.body; // all other values passed from the client, like name, etc..
	//
	// 	console.log(req.file);
	// 	res.json({});
	// });

};
