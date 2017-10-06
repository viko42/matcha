import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';
import { Link } from 'react-router-dom';

import '../../index.css';
import './index.css';

class Profile extends Component {
	componentDidMount() {
		document.title = "Profile";
	}
	render() {
		return (
			<div className="content">
				<Row>
					<Col m={12} s={12}>
						<Card title='Profile page'>Welcome to the profile page.
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Profile;
