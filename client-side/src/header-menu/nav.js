import React, { Component } from 'react';
import { Link } from 'react-router'
import '../App.css';
import {closeNav} from './nav_func'

class Header extends Component {
	render() {
		return (
			<div id="mySidenav" className="sidenav">
				<a className="closebtn sidenavlink" onClick={closeNav}>&times;</a>
				<Link to="/" className="sidenavlink">Accueil</Link>
				<Link to="/" className="sidenavlink">Mon compte</Link>
			</div>
		)
	}
}

module.exports = Header;
