import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';
import {Link} from 'react-router-dom';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'

class App extends Component {
	componentDidMount() {
		document.title = `${logoName} - Home`;
	}
	ifConnected() {
		if (!localStorage.getItem('auth'))
			return (
				<Header>
					<div className="content">
						<Row>
							<Col m={12} s={12}>
								<Card title='S'>Welcome to the home page.
									<Link to="/profile">Here</Link>
								</Card>
							</Col>
							<Col m={6} s={6}>
								<Card title='T'>Welcome to the home page.</Card>
							</Col>
							<Col m={6} s={6}>
								<Card title='T'>Welcome to the home page.</Card>
							</Col>
							<Col m={4} s={4}>
								<Card title='E'>Welcome to the home page.</Card>
							</Col>
							<Col m={4} s={4}>
								<Card title='S'>Welcome to the home page.</Card>
							</Col>
							<Col m={4} s={4}>
								<Card title='S'>Welcome to the home page.</Card>
							</Col>
							<Col m={12} s={12}>
								<Card title='S'>Welcome to the home page.</Card>
							</Col>
							<Col m={12} s={12}>
								<Card title='S'>Welcome to the home page.</Card>
							</Col>
						</Row>
					</div>
				</Header>
			);
		else
			return (
				<Header>
					<div className="content">
						<Row>
							<Col m={12} s={12}>
								<Card title='Trouvez votre crush qui vous ressemble !'>Liste de personne ayant le plus de tag en commun avec vous ! <a href>(Voir plus)</a>

								</Card>
							</Col>
							<Col s={3}>
								<Card title=''></Card>
							</Col>
							<Col s={3}>
								<Card title=''></Card>
							</Col>
							<Col s={3}>
								<Card title=''></Card>
							</Col>
							<Col s={3}>
								<Card title=''></Card>
							</Col>
							<Col m={12} s={12}>
								<Card title='Geolocalisez vos crushs !'>Liste de personne ayant une distance rapprochée de la votre<a href>(Voir plus)</a>

								</Card>
							</Col>
						</Row>
					</div>
				</Header>
			);

	}
	render() {
		return this.ifConnected();
	}
}

export default App;
