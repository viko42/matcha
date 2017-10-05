import React from 'react';
import axios from 'axios';
import $ from 'jquery';
const apiUrl = "http://localhost:8080/";

const tabs = {
	'createUser': {
		'method': 'POST',
		'url': 'http://localhost:8080/users/create'
	}
}

const Services = (props, data, callback) => {
	axios({
		method: tabs[props].method,
		url: tabs[props].url,
		data: data
	}).then(function (res) {
		console.log('OK');
	}).catch(function (err) {
		if (err.response) {
			callback(null, err.response);
		}
	});
}

export default Services;
