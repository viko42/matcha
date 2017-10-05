// import React from 'react'
import axios from 'axios'

function CheckToken(object) {
	var data;

	return (
		axios({
		method: 'post',
		url: 'http://localhost:8080/auth',
		headers: {
			'Accept': 'application/json',
			// 'X-Requested-With': 'XMLHttpRequest'
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {
			token: object.token
		}
	}).then((response) => {
		// console.log("Analyse du token ");
		data = localStorage.token;
		// console.log(data);
		// console.log(response);
		if (response['data']['status'] === "ERR")
			return (5);
		return (10);
	}));
};

export default CheckToken;
