import React, { Component } from 'react';
import '../App.css';
import { SideNav, SideNavItem, Button } from 'react-materialize';

class SideBar extends Component {
  render() {
    return (
		<SideNav
			trigger={<Button>SIDE NAV DEMO</Button>}
			className="side-nav fixed sideBarTest">
			<SideNavItem href='#/' icon='cloud'>Retour à la page d'accueil</SideNavItem>
			<SideNavItem href='#login'>Se connecter</SideNavItem>
			<SideNavItem divider />
			<SideNavItem subheader>Panel</SideNavItem>
			<SideNavItem waves href='#account'>Mon compte</SideNavItem>
			<SideNavItem waves href='#third'>Mes matchs</SideNavItem>
			<SideNavItem waves href='#third'>Mes matchs</SideNavItem>
			<SideNavItem divider />
			<SideNavItem subheader>Aide</SideNavItem>
			<SideNavItem waves href='#support'>Contactez-nous</SideNavItem>
		</SideNav>
    );
  }
}

export default SideBar;
