import User from './db.user'

User.find({}, function(err, user) {
	if (err)
		throw err;
	console.log(user);
});
