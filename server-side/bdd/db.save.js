import User from './db.user'

const viko = new User({
	start,
	end,
	room,
	owner,
	duration_min
});

viko.save(function(err) {
	if (err)
		throw err;
	console.log('Slot saved successfully');
});
