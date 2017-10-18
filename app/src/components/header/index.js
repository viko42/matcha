import React from 'react';
// import {Redirect, Router} from 'react-router-dom';

// import history from './history.js'
import { Navbar, NavItem, Icon, Dropdown } from 'react-materialize';
import './index.css';

import $ from 'jquery';
import Footer from '../footer'
import SideBar from '../sidebar'
import swal from 'sweetalert';
import services from '../../config/services';

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

		this.state = {
			notificationUnread: false,
			notifications: [],
		};
		this.logout = this.logout.bind(this);
		this.notifications = this.notifications.bind(this);

		this.getNotifications = this.getNotifications.bind(this);
		this.serviceNotifications = this.serviceNotifications.bind(this);
		this.setAsRead = this.setAsRead.bind(this);
	}
	getNotifications(notifications) {
		var renderNotifications = [];

		if (notifications.length < 1)
			renderNotifications.push(
				<div key={i} className="notif-elem-cont"><div className="notif-elem"><Icon>mail</Icon>Aucune notification</div></div>
			);
		for (var i = 0; i < notifications.length; i++) {
			renderNotifications.push(
				<div key={i} className="notif-elem-cont"><div className="notif-elem"><Icon>{notifications[i].status === "unread" ? "mail" : "mail_outline"}</Icon>{notifications[i].message}</div></div>
			);

			if (i + 1 < notifications.length)
				renderNotifications.push(<hr key={i+'hr'} className="fullhr-notif"/>);
		}
		this.setState({notifications: renderNotifications});
	}
	setAsRead() {
		const self = this;

		console.log('Reading the notification');
		services('notificationsSetAsRead', {getData: ""}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.serviceNotifications();
			// if (response.data.notifications) {
			// 	self.getNotifications(response.data.notifications);
			// 	self.setState({notificationUnread: response.data.unread})
			// }
		})
	}
	serviceNotifications() {
		const self = this;

		services('notifications', {getData: ""}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			if (response.data.notifications) {
				self.getNotifications(response.data.notifications);
				self.setState({notificationUnread: response.data.unread})
			}
		})
	}
	componentDidMount() {
		const	self	= this;
		var		nav		= document.getElementsByClassName('col s12')[0];
		// Create the Home button
		var		node	= document.createElement("a");

		// var textnode = document.createTextNode("☰");
		node.setAttribute("data-activates", "sidenav_0");
		node.setAttribute("class", "sideNavMenu");
		// node.appendChild(textnode);
		nav.appendChild(node);

		// Disable the older home button
		nav = document.querySelectorAll('[data-activates="nav-mobile"]')[0];
		nav.setAttribute("style", "display: none;");

		// Get your notifications
		this.serviceNotifications();

		global.socket.on('test_message', function (data) {
			self.serviceNotifications();
			self._notificationSystem.addNotification({
				message: data.message,
				level: data.status,
				action: {
					label: 'Voir le message',
					callback: function() {
						window.location.assign(urlApp + "/#/inbox");
					}
				},
			});
		})
		$('body').addClass('loaded');

    	this._notificationSystem = this.refs.notificationSystem;
	}
	notifications(e) {
		e.preventDefault();

		if (this.state.notification === true)
			this.setAsRead();

		this.setState({notification: this.state.notification === true ? false : true});
	}
	componentWillUnmount() {
		global.socket.off('test_message');
	}
	logout(e) {
		e.preventDefault();

		global.socket.emit('logout');
		window.location.assign(urlApp + "/#/logout");
	}
	render() {
		return (
			<div>
	        	<NotificationSystem ref="notificationSystem" />
				<Navbar href='#/' brand='CrushYard' className="navbar show-in-small" right>
					<NavItem className="show-in-small" onClick={this.notifications}>
						{this.state.notificationUnread === true && <Icon className="notif-unread" >notifications</Icon>}
						{this.state.notificationUnread === false && <Icon>notifications</Icon>}
					</NavItem>


					{this.state.notification === true && <div className="notif-cont">
						{this.state.notifications}
					</div>}
					<NavItem className="hide-in-small" href='#/inbox'><Icon>chat</Icon></NavItem>
					<NavItem className="hide-in-small" href='#/search'><Icon>search</Icon></NavItem>

					{ localStorage.getItem('auth') && <span className="dropDrownNavbar">
						<Dropdown data-constrainwidth="false" data-stoppropagation="true" trigger={
							<li data-beloworigin="true" data-activates='dropdown_0'><a><Icon>more_vert</Icon></a></li>
						}>
							<NavItem href="#/profile/me">My profile</NavItem>
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
