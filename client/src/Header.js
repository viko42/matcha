import { Link } from 'react-router'
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './menu.css';
// import CheckToken from './auth'
import GetToken from './test'


function myFunction(e) {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

class Header extends Component {
	state = {
		error: "",
		ready: false
	}
	async componentDidMount() {
		// console.log("Check de la connexion");
		const test = new GetToken();
		let res = await test.getTokenx();
		if (res === true) {
			// console.log("Check de la connexion OK");
			this.setState({
				ready: true
			});
		}
	}
	render() {
		return (
			<div id="head-menu">
				<ul className="topnav" id="myTopnav"><center>
					<li><Link to="/" className="link_menu">HOME</Link></li>
				{!this.state.ready &&
					<li><Link to="/register" className="link_menu">REGISTER</Link></li>
				}
					<li><Link to="/account" className="link_menu">ACCOUNT</Link></li>
					<li><Link to="/deconnexion" className="link_menu">CONTACT</Link></li>
				{this.state.ready &&
					<li><Link to="/deconnexion" className="link_menu">LOGOUT</Link></li>
				}
					<li className="icon">
						<a href="javascript:void(0);" className="IconHeader" onClick={myFunction}>☰</a>
					</li>
				</center></ul>
			</div>
		)
	}
}

export default Header;
