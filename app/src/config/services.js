import axios from 'axios';
import {getLocalStorage, remLocalStorage} from './policies'

const {apiUrl} = require('./crushyard');

const tabs = {

	//###################################################################
	// 							Users
	//###################################################################

	'createUser': {
		'method': 'POST',
		'url': apiUrl + '/users/create'
	},

	'blockUser': {
		'method': 'POST',
		'url': apiUrl + '/users/block'
	},

	'getTags': {
		'method': 'GET',
		'url': apiUrl + '/users/tags'
	},

	'reset': {
		'method': 'POST',
		'url': apiUrl + '/users/reset'
	},

	'resetpassword': {
		'method': 'POST',
		'url': apiUrl + '/users/reset/password'
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

	'getAccount': {
		'method': 'GET',
		'url': apiUrl + '/account'
	},

	'updateAccount': {
		'method': 'PUT',
		'url': apiUrl + '/account/update'
	},

	'updateLocalization': {
		'method': 'PUT',
		'url': apiUrl + '/account/update/localization'
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

	'deleteAvatar': {
		'method': 'POST',
		'url': apiUrl + '/profile/avatar/delete'
	},

	'changeAvatar': {
		'method': 'POST',
		'url': apiUrl + '/profile/avatar/change'
	},

	'getAvatar': {
		'method': 'GET',
		'url': apiUrl + '/profile/avatar/find/'
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

	'findAffinate': {
		'method': 'POST',
		'url': apiUrl + '/find/affinate'
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



	//###################################################################
	// 							Report
	//###################################################################

	'reportUser': {
		'method': 'POST',
		'url': apiUrl + '/report'
	},

	//###################################################################
	// 							Geolocation Google
	//###################################################################

	'findPosition': {
		'method': 'GET',
		'url': "https://maps.googleapis.com/maps/api/geocode/json?latlng="
	},

	'getPositions': {
		'method': 'GET',
		'url': apiUrl + '/maps'
	},
}

const services = (props, data, callback) => {
	var get_data = data.getData ? data.getData : '';

	axios({
		method: tabs[props].method,
		url: tabs[props].url + get_data,
		headers: {
			'authorization': getLocalStorage('auth')
		},
		data: {
			...data,
			socketId: global.socket ? global.socket.id : null
		}
	}).then(function (res) {
		return callback(null, res);
	}).catch(function (err) {
		if (err.response && err.response.data === 'invalid token') {
			try {
				remLocalStorage('auth');
				remLocalStorage('user');
			} catch (e) {}

			return callback(err.response.data.errors, err.response);
		}
		if (err.response)
			return callback(err.response.data.errors, err.response);
	});
}

export function GoogleApi(props, data, callback) {
	var apiGoogle	= "AIzaSyAWyS9AomCahBfTue98dIGMcCozwbgKBbc";
	var get_data	= data.getData ? data.getData : '';

	axios({
   	 method: tabs[props].method,
   	 url: tabs[props].url + get_data + "&key=" + apiGoogle,
   	 headers: {
		 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
	 },
   	 data: {}
    }).then(function (res) {
		return callback(null, res);
    }).catch(function (err) {
		if (err.response)
			return callback(null, null);
	});
}

export default services;
