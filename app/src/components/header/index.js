import React from 'react';
import './index.css';
import { Navbar, NavItem, Icon, Dropdown } from 'react-materialize';

class Header extends React.Component {
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
	}
	render() {
		return (
			<Navbar brand='CrushYard' className="navbar" right>
				<NavItem href='#'><Icon>search</Icon></NavItem>
				<span className="dropDrownNavbar">
					<Dropdown data-constrainwidth="false" data-stoppropagation="true" trigger={
						<li data-beloworigin="true" data-activates='dropdown_0'><a><Icon>more_vert</Icon></a></li>
					}>
						<NavItem href="#/profile">My profile</NavItem>
						<NavItem href="/profile/edit">Edit my profile</NavItem>
						<NavItem divider />
						<NavItem href="/logout">Logout</NavItem>
					</Dropdown>
				</span>
			</Navbar>
		);
	}
}

export default Header;
