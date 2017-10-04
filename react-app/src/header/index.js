import React from 'react';
import '../App.css';
import { Navbar, NavItem, Icon, Dropdown } from 'react-materialize';

class Header extends React.Component {
  render() {
    return (
		<Navbar brand='Exa' className="navbar" right>
			<NavItem href='#'><Icon>search</Icon></NavItem>
			<NavItem href='#'><Icon>view_module</Icon></NavItem>
			<span className="dropDrownNavbar">
				<Dropdown constrainwidth="false" stoppropagation="true" trigger={
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
