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

	//####################################################################
	//						Profile
	var Profile = require('../controllers/ProfileController');
	//--------------------------------------------------------------------

	app.route('/profile/:id')		.get(isConnected.authorization, Profile.getProfile);
	app.route('/profile/update')	.put(isConnected.authorization, Profile.updateProfile);
	// app.route('/profile/upload').get(isConnected.authorization, Profile.uploadImage);


	//####################################################################
	//						Crushs
	var Crushs = require('../controllers/CrushsController');
	//--------------------------------------------------------------------

	app.route('/crushs/:id')			.get(isConnected.authorization, Crushs.doCrush);
	app.route('/crushs/:id/remove')		.get(isConnected.authorization, Crushs.removeCrush);
	app.route('/crushs/:id/start')		.get(isConnected.authorization, Crushs.startConversation);

	//####################################################################
	//						Account
	var Account = require('../controllers/AccountController');
	//--------------------------------------------------------------------

	app.route('/account/update')	.put(isConnected.authorization, Account.update);

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
	//						Auth
	//--------------------------------------------------------------------

	app.route('/login')			.post(Users.login);



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
