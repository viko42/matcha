import React, { Component } from 'react';
import { Link } from 'react-router'
import '../App.css';
import {closeNav} from './nav_func'

class Header extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}
	render() {
		return (
			<div id="mySidenav" className="sidenav">
				<a className="closebtn sidenavlink" onClick={closeNav}>&times;</a>
				<Link to="/" className="sidenavlink">Accueil</Link>
				<Link to="/register" className="sidenavlink">Inscription</Link>
				<Link to="/profile" className="sidenavlink">Mon compte</Link>
				<Link to="/login" className="sidenavlink">Se connecter</Link>
			</div>
		)
	}
}

module.exports = Header;
