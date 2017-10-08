var mongoose	= require('mongoose');
var s			= require('../config/services');
var async		= require('async');
var _			= require('lodash');
var bcrypt		= require('bcrypt');
var Messages	= mongoose.model('Messages');

exports.inbox = function(req, res) {
	// const user = new Users(req.connectedAs);

	console.log(req.body);
	async.waterfall([
		function (callback) {
			return callback();
		},
	], function (err) {
		if (err)
			return s.serverError(res, err);
		console.log(req.connectedAs);
		return res.status(200).json({inbox: {} });
	})
};
