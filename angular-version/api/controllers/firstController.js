var mongoose	= require('mongoose');
var Task		= mongoose.model('Tasks');
var s			= require('../config/services');

exports.allTasks = function (req, res) {
	Task.find({}, function (err, results) {
		if (err)
			return s.serverError(res, err);
		return res.json(results);
	});
};

exports.createTask = function(req, res) {
	var nameTask	= req.params.name;

	if (!nameTask)
		return s.serverError(res, "Need a nameTask.");

	var new_task = new Task(req.body);
		new_task.save(function(err, task) {
			if (err)
				return s.serverError(res, err);
		res.json(task);
	});
};
