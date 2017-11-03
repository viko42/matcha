const thisHelper	= "isObjectValid";

exports.isObjectValid = function (id) {
	if (String(id).match("^[0-9a-fA-F]{24}$"))
		return true;
	return false;
};
