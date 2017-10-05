import User from './db.user'

const newUser = User({
	user_id: "1",
	name: "Victor",
	firstname: "Lancien",
	email: "v.lancien@live.fr",
	password: "qwqwqw",
	admin: "1",
	activate: "0"
});

newUser.save(function(err) {
	if (err)
		throw err;
	console.log('New user added');
});
