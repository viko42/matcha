import React, { Component } from 'react';
// import { Router, Route, } from 'react-router'
// import LogIn from './App'
import '../App.css';
import '../menu.css';
import Header from '../Header'
import axios from 'axios'
// import { Router } from 'react-router'
// import CheckToken from '../auth'
// import GetToken from '../test'


// function LogIn(e) {
// 	e.preventDefault();
// 	var LogInUser = e.target.login.value;
// 	var LogInPass = e.target.password.value;
//
// 	axios({
// 		method: 'put',
// 		url: 'http://localhost:8080/login',
// 		headers: {
// 			'Accept': 'application/json'
// 			// 'Content-Type': 'application/x-www-form-urlencoded'
// 		},
// 		data: {
// 			'login': LogInUser,
// 			'password': LogInPass
// 		}
// 	}).then((response) => {
// 		console.log("Tentative de connexion");
// 		return (response);
// 	}).then(function(dat) {
// 		console.log("Ma data:", dat['data']['token']);
// 		localStorage.setItem('token', dat['data']['token']);
// 		// window.location.replace("http://localhost:3000");
// 	})
// }

class Content extends Component {

	LogIn(e) {
		e.preventDefault();
		var LogInUser = e.target.login.value;
		var LogInPass = e.target.password.value;

		axios({
			method: 'put',
			url: 'http://localhost:8080/login',
			headers: {
				'Accept': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				'login': LogInUser,
				'password': LogInPass
			}
		}).then((response) => {
			console.log("Tentative de connexion");
			return (response);
		}).then(function(dat) {
			console.log("Ma data:", dat['data']['token']);
			localStorage.setItem('token', dat['data']['token']);
			// window.location.replace("http://localhost:3000");
		})
	}
	render() {
		return (
			<div>
				<form onSubmit={this.LogIn}>
					Login:<input type="text" name="login" /><br/>
					Password:<input type="text" name="password" /><br/>
					<input type="submit" name="submit"/>
				</form>
			</div>
		)
	}
}

class Register extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<div id="Register">
					<Content />
				</div>
			</div>
		)
	}
}

export default Register;
