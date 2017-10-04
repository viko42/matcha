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
					<Card title='404 NOT FOUND'>Page inexistante
						<p><Link to="/">Cliquez ici pour retourner sur la page d'accueil</Link></p>
					</Card>
				</Col>
			</Row>
		</div>
    );
  }
}

export default Profile;
