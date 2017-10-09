import axios from 'axios';
const apiUrl = "http://localhost:8080";

const tabs = {

	//###################################################################
	// 							Users
	//###################################################################

	'createUser': {
		'method': 'POST',
		'url': apiUrl + '/users/create'
	},

	//###################################################################
	// 							Login
	//###################################################################

	'loginUser': {
		'method': 'POST',
		'url': apiUrl + '/login'
	},

	//###################################################################
	// 							Account
	//###################################################################

	'updateAccount': {
		'method': 'PUT',
		'url': apiUrl + '/account/update'
	},

	//###################################################################
	// 							Messages
	//###################################################################

	'getMyInbox': {
		'method': 'GET',
		'url': apiUrl + '/inbox'
	},

	'sendMessage': {
		'method': 'POST',
		'url': apiUrl + '/inbox/send'
	},
}

const Services = (props, data, callback) => {
	axios({
		method: tabs[props].method,
		url: tabs[props].url,
		headers: {
			'authorization': localStorage.getItem('auth')
		},
		data: data
	}).then(function (res) {
		return callback(null, res);
	}).catch(function (err) {
		if (err.response && err.response.data === 'invalid token') {
			localStorage.removeItem('auth');
			localStorage.removeItem('user');
			window.location.reload();
			return callback(err.response.data.errors, err.response);
		}
		if (err.response)
			return callback(err.response.data.errors, err.response);
		// return callback({}, 'server error');

	});
}

export default Services;
