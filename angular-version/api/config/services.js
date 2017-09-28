exports.serverError = function(res, err) {
	console.log('Service serverError', err);
	return res.status(500).json({error: "incorrect action"});
};

exports.badRequest = function(res, err) {
	console.log('Service badRequest');
	return res.status(403).json({error: err});
};

exports.notFound = function(res, err) {
	console.log('Service notFound');
	return res.status(404).json({error: err});
};

exports.forbidden = function(res, err) {
	console.log('Service forbidden');
	return res.status(401).json({error: err});
};
