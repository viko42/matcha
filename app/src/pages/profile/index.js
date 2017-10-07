import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Profile extends Component {
	componentDidMount() {
		document.title = "Profile";
	}
	render() {
		return (
			<div>
				<Header />
				<SideBar />
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Profile page'>Edit your profile page</Card>
						</Col>
					</Row>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Profile;
