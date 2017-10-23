import React, { Component } from 'react';
import './index.css';
import { SideNav, SideNavItem } from 'react-materialize';
import $ from 'jquery';

import {getLocalStorage} from '../../config/policies'

window.onhashchange = function () {
	var width			= $(document).width();
	var closeSideBar	= document.getElementById('sidenav-overlay');
	if (width < 993 && closeSideBar)
		$("#sidenav-overlay").trigger("click");
}

class SideBar extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	updateDimensions() {
		var closeSideBar = document.getElementById('sidenav-overlay');
		if (closeSideBar)
			$("#sidenav-overlay").trigger("click");
	}
	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
    }
    componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}
	ifConnected() {
		if (!getLocalStorage('auth'))
			return (
				<SideNav
					trigger={<h1 className="testButton">☰</h1>}
				className="side-nav fixed sideBarDiv">
					<SideNavItem href='#/' icon='cloud'>Retour à la page d'accueil</SideNavItem>
					<SideNavItem href='#login'>Se connecter</SideNavItem>
					<SideNavItem href='#register'>Inscription</SideNavItem>
					<SideNavItem divider />
					<SideNavItem subheader>Aide</SideNavItem>
					<SideNavItem waves href='#support'>Contactez-nous</SideNavItem>
				</SideNav>
				);
		else
			return (
				<SideNav
					trigger={<h1 className="testButton">☰</h1>}
				className="side-nav fixed sideBarDiv">
					<SideNavItem userView
						user={{
							background: 'img/office.jpg',
							image: 'img/yuna.jpg',
							name: getLocalStorage('user').firstName + ' ' + getLocalStorage('user').lastName,
							email: getLocalStorage('user').email
						}}
					/>
					{/* <SideNavItem href='#/' icon='cloud'>Retour à la page d'accueil</SideNavItem> */}
					{/* <SideNavItem divider /> */}
					<SideNavItem subheader>Panel</SideNavItem>
					<SideNavItem waves href='#account' icon="person">Mon compte</SideNavItem>
					<SideNavItem waves href='#crushs' icon="people">Crushs</SideNavItem>
					<SideNavItem waves href='#inbox' icon="message">Messagerie</SideNavItem>
					<SideNavItem waves href='#visits' icon="hearing">Mes visites</SideNavItem>
					<SideNavItem waves href='#likes' icon="hearing">Mes likes</SideNavItem>
					<SideNavItem divider />
					<SideNavItem subheader>Aide</SideNavItem>
					<SideNavItem waves icon="help" href='#support'>Contactez-nous</SideNavItem>
				</SideNav>
				);
	}
	render() {
		return this.ifConnected();
	}
}

export default SideBar;
