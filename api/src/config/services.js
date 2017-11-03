exports.serverError = function(res, err, controller) {
	// console.log(controller, 'Service serverError');
	return res.status(403).json({errors: "incorrect action"});
};

exports.badRequest = function(res, err, controller) {
	// console.log(controller, 'Service badRequest', err);
	return res.status(403).json(err);
};

exports.notFound = function(res, err, controller) {
	// console.log(controller, 'Service notFound', err);
	return res.status(404).json(err);
};

exports.forbidden = function(res, err, controller) {
	// console.log(controller, 'Service forbidden');
	return res.status(401).json(err);
};
