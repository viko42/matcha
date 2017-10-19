import axios from 'axios';
const {apiUrl} = require('./crushyard');

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

	//###################################################################
	// 							Profile
	//###################################################################

	'getProfile': {
		'method': 'GET',
		'url': apiUrl + '/profile/'
	},

	'updateProfile': {
		'method': 'PUT',
		'url': apiUrl + '/profile/update'
	},

	'uploadImage': {
		'method': 'POST',
		'url': apiUrl + '/profile/upload'
	},

	//###################################################################
	// 							Crushs
	//###################################################################

	'getCrush': {
		'method': 'GET',
		'url': apiUrl + '/crushs'
	},

	'doCrush': {
		'method': 'GET',
		'url': apiUrl + '/crushs/'
	},

	'removeCrush': {
		'method': 'GET',
		'url': apiUrl + '/crushs/'
	},

	'startConversation': {
		'method': 'GET',
		'url': apiUrl + '/crushs/'
	},

	'getLikes': {
		'method': 'GET',
		'url': apiUrl + '/crushs/likes'
	},

	//###################################################################
	// 							Visits
	//###################################################################

	'getVisits': {
		'method': 'GET',
		'url': apiUrl + '/visits'
	},

	//###################################################################
	// 							Search
	//###################################################################

	'find': {
		'method': 'POST',
		'url': apiUrl + '/find'
	},

	//###################################################################
	// 							Notifications
	//###################################################################

	'notifications': {
		'method': 'GET',
		'url': apiUrl + '/notifications'
	},

	'notificationsSetAsRead': {
		'method': 'GET',
		'url': apiUrl + '/notifications/read'
	},

}

const Services = (props, data, callback) => {
	var get_data = data.getData ? data.getData : '';

	console.log(tabs[props].url + get_data);
	axios({
		method: tabs[props].method,
		url: tabs[props].url + get_data,
		headers: {
			'authorization': localStorage.getItem('auth')
		},
		data: {
			...data,
			socketId: global.socket.id
		}
	}).then(function (res) {
		return callback(null, res);
	}).catch(function (err) {
		if (err.response && err.response.data === 'invalid token') {
			localStorage.removeItem('auth');
			localStorage.removeItem('user');
			// window.location.reload();
			return callback(err.response.data.errors, err.response);
		}
		if (err.response)
			return callback(err.response.data.errors, err.response);
		// return callback({}, 'server error');

	});
}

export default Services;
