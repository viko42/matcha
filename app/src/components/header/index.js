import React from 'react';
import {Redirect, Router} from 'react-router-dom';

// import history from './history.js'
import { Navbar, NavItem, Icon, Dropdown } from 'react-materialize';
import './index.css';

import $ from 'jquery';
import Footer from '../footer'
import SideBar from '../sidebar'
import io from "socket.io-client";
const { urlApp, apiUrl } = require('../../config/crushyard');

var NotificationSystem = require('react-notification-system'); //https://github.com/igorprado/react-notification-system
var socket = io.connect(apiUrl, {
	query: {token: localStorage.getItem('auth')}
});
global.socket = socket;

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.logout = this.logout.bind(this);
	}
	componentDidMount() {
		var nav = document.getElementsByClassName('col s12')[0];

		// Create the Home button
		var node = document.createElement("a");
		// var textnode = document.createTextNode("☰");
		node.setAttribute("data-activates", "sidenav_0");
		node.setAttribute("class", "sideNavMenu");
		// node.appendChild(textnode);
		nav.appendChild(node);

		// Disable the older home button
		nav = document.querySelectorAll('[data-activates="nav-mobile"]')[0];
		nav.setAttribute("style", "display: none;");

		const self = this;
		global.socket.on('test_message', function (data) {
			self._notificationSystem.addNotification({
				message: data.message,
				level: data.status,
				action: {
					label: 'Voir le message',
					callback: function() {
						window.location.assign(urlApp + "/#/inbox");
						// if (history.location.pathname !== '/inbox') {
						// 	history.push('/inbox');
						// 	console.log('PUSH TO INBOX');
						// }
						// else {
						// 	console.log('NOT PUSHING TO INBOX');
						// }
					}
				},
			});
		})
		$('body').addClass('loaded');

    	this._notificationSystem = this.refs.notificationSystem;
	}
	componentWillUnmount() {
		global.socket.off('test_message');
	}
	logout(e) {
		e.preventDefault();
		window.location.assign(urlApp + "/#/logout");
	}
	render() {
		return (
			<div>
	        	<NotificationSystem ref="notificationSystem" />
				<Navbar brand='CrushYard' className="navbar show-in-small" right>
					<NavItem className="show-in-small" href='#'><Icon>notifications</Icon></NavItem>
					<NavItem className="hide-in-small" href='#'><Icon>chat</Icon></NavItem>
					<NavItem className="hide-in-small" href='#'><Icon>search</Icon></NavItem>

					{ localStorage.getItem('auth') && <span className="dropDrownNavbar">
						<Dropdown data-constrainwidth="false" data-stoppropagation="true" trigger={
							<li data-beloworigin="true" data-activates='dropdown_0'><a><Icon>more_vert</Icon></a></li>
						}>
							<NavItem href="#/profile/me">My profile</NavItem>
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
