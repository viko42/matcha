import React, { Component } from 'react';
import { Link } from 'react-router'
import { closeNav } from './nav_func'
// import Auth from '../account/login/auth'
import './nav.css'
import axios from 'axios'

class Header extends Component {
	constructor() {
		super();
		this.state = {
			lastname: '',
			firstname: '',
			age: '',
			img: '',
			status: false
		}
		this.isConnected();
	}
	logout() {
		localStorage.removeItem('token');
		this.state.status = false;
		console.log("Removed");
	}
	async isConnected() {
		let obj;
		const _this = this;

		await axios({
			method: 'post',
			url: 'http://localhost:8080/auth',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			data: {
				id: localStorage.getItem('id'),
				token: localStorage.getItem('token')
			}
		}).then((res) => {
			if (res.data.status === true) {
				const user = res.data.UserTrack;

				this.setState({lastname: user.name});
				this.setState({firstname: user.firstname});
			}
			this.setState({status: true});
			console.log("Status: " + this.state.status);
		});
		// console.log(this.state.lastname);
	}
	// PublicData() {
	// 	let publicData = []
	//
	// 	console.log("PUBLIC DATA");
	// 	publicData.push(
	// 		<div>
	// 			Connected as
	// 		</div>
	// 	);
	// 	return (publicData);
	// }
	render() {
		return (
			<div id="mySidenav" className="sidenav">
				{this.state.status &&
					<div>
						<div id="nav-personnal-img"></div>
						<h4>{this.state.lastname} {this.state.firstname}</h4>
					</div>}
				<a className="closebtn sidenavlink" onClick={closeNav}>&times;</a>
				<Link to="/" className="sidenavlink">Accueil</Link>
				{!this.state.status && <Link to="/register" className="sidenavlink">Inscription</Link>}
				{this.state.status && <Link to="/profile" className="sidenavlink">Mon compte</Link>}
				{!this.state.status && <Link to="/login" className="sidenavlink">Se connecter</Link>}
				{this.state.status && <Link to="/" onClick={this.logout.bind(this)} className="sidenavlink">Se deconnecter</Link>}
			</div>
		)
	}
}

module.exports = Header;
