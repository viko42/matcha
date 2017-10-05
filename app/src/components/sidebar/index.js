import React, { Component } from 'react';
import './index.css';
import { SideNav, SideNavItem, Button } from 'react-materialize';
import $ from 'jquery';

window.onhashchange = function () {
	var width			= $(document).width();
	var closeSideBar	= document.getElementById('sidenav-overlay');
	if (width < 993 && closeSideBar)
		$("#sidenav-overlay").trigger("click");
}

class SideBar extends Component {
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
	render() {
		return (
			<SideNav
				trigger={<Button>SIDE NAV DEMO</Button>}
			className="side-nav fixed sideBarDiv">
				<SideNavItem href='#/' icon='cloud'>Retour à la page d'accueil</SideNavItem>
				<SideNavItem href='#register'>Inscription</SideNavItem>
				<SideNavItem href='#login'>Se connecter</SideNavItem>
				<SideNavItem divider />
				<SideNavItem subheader>Panel</SideNavItem>
				<SideNavItem waves href='#account'>Mon compte</SideNavItem>
				<SideNavItem waves href='#third'>Crushs</SideNavItem>
				<SideNavItem waves href='#third'>Messagerie</SideNavItem>
				<SideNavItem divider />
				<SideNavItem subheader>Aide</SideNavItem>
				<SideNavItem waves href='#support'>Contactez-nous</SideNavItem>
			</SideNav>
		);
	}
}

export default SideBar;
