import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header'
import {logoName} from '../../config/crushyard'

class Profile extends Component {
	componentDidMount() {
		document.title = `${logoName} - Profile`;
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Profile page'>Edit your profile page</Card>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Profile;
