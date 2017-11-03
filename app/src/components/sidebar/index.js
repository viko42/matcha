import React, { Component }		from 'react';
import { SideNav, SideNavItem }	from 'react-materialize';

import $					from 'jquery';
import services				from '../../config/services';

import {getLocalStorage}	from '../../config/policies'
import './index.css';

window.onhashchange = function () {
	var width			= $(document).width();
	var closeSideBar	= document.getElementById('sidenav-overlay');
	if (width < 993 && closeSideBar)
		$("#sidenav-overlay").trigger("click");
}

class SideBar extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			avatar: "http://www.bmxpugetville.fr/wp-content/uploads/2015/09/avatar.jpg",
		};
	}
	updateDimensions() {
		var closeSideBar = document.getElementById('sidenav-overlay');
		if (closeSideBar)
			$("#sidenav-overlay").trigger("click");
	}
	componentDidMount() {
		const self = this;
		window.addEventListener("resize", this.updateDimensions);

		if (!getLocalStorage('user'))
			return ;

		services('getAvatar', {getData: getLocalStorage('user').username}, function (err, response) {
			if (self._isMount === false)
				return ;
			if (response.data.src && self._isMount)
				return self.setState({avatar: response.data.src});
		})
    }
    componentWillUnmount() {
		this._isMount = false;
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
							image: this.state.avatar,
							user: "test",
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
					<SideNavItem waves href='#visits' icon="add_to_queue">Mes visites</SideNavItem>
					<SideNavItem waves href='#likes' icon="hearing">Mes likes</SideNavItem>
					<SideNavItem waves href='#maps' icon="maps">Maps</SideNavItem>
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
