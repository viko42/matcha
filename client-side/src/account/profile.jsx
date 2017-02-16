import React, { Component } from 'react'
import './profile.css'
import HeaderFull from '../header-menu/header'

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFocus: 'Phone',
		}
	}
	componentDidMount() {
		document.title = "Profile - Matcha";
	}
	render() {
		return (
    	<div>
			<HeaderFull />
			<div className="App-content">
				<div className="Content-profile-header">
					<center>
						<div className="Content-profile-avatar"></div>
					</center>
				</div>
				<div className="Content-profile-zone">
					<div className="Content-profile-name">Victor Lancien</div>
					<div className="Content-profile-infos">
					{/* <h4>Data: {this.state.isFocus}</h4> */}
					<div className="Content-profile-infos-1">
						Phone:<br/>
						Email:<br/>
						Localisation:<br/>
					</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
}


export default Profile;