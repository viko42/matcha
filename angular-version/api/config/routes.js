module.exports = function (app) {

	//####################################################################
	//						Users
	var Users = require('../controllers/UsersController');
	//####################################################################

	app.route('/users')			.get(Users.list);
	app.route('/users/create')	.post(Users.create);
	app.route('/users/update')	.put(Users.update);
	app.route('/users/delete')	.delete(Users.delete);

	//####################################################################
	//						Auth
	//####################################################################

	app.route('/login')			.post(Users.login);
};
