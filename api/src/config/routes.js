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

	app.route('/profile/:id')	.get(isConnected.authorization, Profile.getProfile);
	// app.route('/profile/update')	.put(isConnected.authorization, Profile.updateProfile);

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
	//						Auth
	//--------------------------------------------------------------------

	app.route('/login')			.post(Users.login);
};
