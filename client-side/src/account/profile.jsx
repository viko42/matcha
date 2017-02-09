import React, { Component } from 'react'
import './profile.css'
import HeaderFull from '../header-menu/header'

class Profile extends Component {
	componentDidMount() {
		document.title = "Profile - Matcha";
	}
	render() {
		return (
    	<div>
			<HeaderFull />
		</div>
		);
	}
}


export default Profile;
