exports.serverError = function(res, err) {
	console.log('Service serverError', err);
	return res.status(500).json({error: "incorrect action"});
};

exports.badRequest = function(res, err) {
	console.log('Service badRequest', err);
	return res.status(403).json(err);
};

exports.notFound = function(res, err) {
	console.log('Service notFound', err);
	return res.status(404).json(err);
};

exports.forbidden = function(res, err) {
	console.log('Service forbidden', err);
	return res.status(401).json(err);
};
