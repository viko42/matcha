import React from 'react';
import {Redirect} from 'react-router-dom';
import { Navbar, NavItem, Icon, Dropdown } from 'react-materialize';
import './index.css';

import $ from 'jquery';
import Footer from '../footer'
import SideBar from '../sidebar'
import io from "socket.io-client";
const socket = io.connect('http://localhost:8080', {
	query: {token: localStorage.getItem('auth')}
});

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		global.socket = socket;
		this.logout = this.logout.bind(this);
	}
	componentDidMount() {
		var nav = document.getElementsByClassName('col s12')[0];

		// Create the Home button
		var node = document.createElement("a");
		var textnode = document.createTextNode("☰");
		node.setAttribute("data-activates", "sidenav_2");
		node.setAttribute("class", "sideNavMenu");
		node.appendChild(textnode);
		nav.appendChild(node);

		// Disable the older home button
		nav = document.querySelectorAll('[data-activates="nav-mobile"]')[0];
		nav.setAttribute("style", "display: none;");

		$('body').addClass('loaded');
	}
	logout(e) {
		e.preventDefault();
		this.setState({redirect: true})
	}
	render() {
		if (this.state.redirect) {
			return <Redirect to="/logout" />;
		}
		return (
			<div>
			<Navbar brand='CrushYard' className="navbar show-in-small" right>
				<NavItem className="show-in-small" href='#'><Icon>notifications</Icon></NavItem>
				<NavItem className="hide-in-small" href='#'><Icon>chat</Icon></NavItem>
				<NavItem className="hide-in-small" href='#'><Icon>search</Icon></NavItem>

				{ localStorage.getItem('auth') && <span className="dropDrownNavbar">
					<Dropdown data-constrainwidth="false" data-stoppropagation="true" trigger={
						<li data-beloworigin="true" data-activates='dropdown_0'><a><Icon>more_vert</Icon></a></li>
					}>
						<NavItem href="#/profile">My profile</NavItem>
						<NavItem href="#/profile/edit">Edit my profile</NavItem>
						<NavItem divider />
						<NavItem onClick={this.logout}>Logout</NavItem>
					</Dropdown>
				</span> }
			</Navbar>
			<SideBar/>
			{this.props.children}
			<Footer/>
			</div>
		);
	}
}

export default Header;
