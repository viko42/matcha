import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';
import { Link } from 'react-router-dom';
import './index.css';

class Profile extends Component {
  render() {
    return (
		<div className="content">
			<Row>
				<Col m={12} s={12}>
					<Card title='S'>Welcome to the profile page.
						<Link to="/">Return to the  home page</Link>
					</Card>
				</Col>
			</Row>
		</div>
    );
  }
}

export default Profile;
