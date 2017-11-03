const mongoose		= require('mongoose');
const Users			= mongoose.model('Users');
const thisHelper	= "getAvatar";

exports.getAvatar = function (id) {
	var defaultAvatar = "http://www.bmxpugetville.fr/wp-content/uploads/2015/09/avatar.jpg";

	Users.findOne({'_id': id}).exec(function (err, userFound) {
		if (err || !userFound)
			return defaultAvatar;

		var isAvatar = true;

		if (!userFound || !userFound.data.pictures || (!userFound.data.avatarID && !userFound.data.pictures[0]))
			isAvatar = false;

		if (!userFound.data.avatarID || !userFound.data.pictures[userFound.data.avatarID])
			userFound.data.avatarID = 0;

		if (isAvatar === false)
			return defaultAvatar;
		return userFound.data.pictures[userFound.data.avatarID].data;
	});
};
