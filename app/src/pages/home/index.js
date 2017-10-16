import React, { Component } from 'react';
import { Col, Card, Row, Button } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'

class App extends Component {
	constructor(props) {
		super(props);

		this.ifConnected = this.ifConnected.bind(this);
	}
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
								<Card title='S'>Welcome to the home page</Card>
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
								<Card title='Trouvez votre crush qui vous ressemble !'>Liste de personne ayant le plus de tag en commun avec vous ! <a href>(Voir plus)</a></Card>
							</Col>
							<Col l={6} m={6} s={12} className="xl3">
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
									<div className="public-tag-buttons">
										<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
									</div>
								</Card>
							</Col>
							<Col l={6} m={6} s={12} className="xl3">
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
									<div className="public-tag-buttons">
										<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
									</div>
								</Card>
							</Col>
							<Col l={6} m={6} s={12} className="xl3">
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
									<div className="public-tag-buttons">
										<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
									</div>
								</Card>
							</Col>
							<Col l={6} m={6} s={12} className="xl3">
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
									<div className="public-tag-buttons">
										<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
									</div>
								</Card>
							</Col>
							<Col m={12} s={12}>
								<Card title='Geolocalisez vos crushs !'>Liste de personne ayant une distance rapprochée de la votre<a href>(Voir plus)</a>

								</Card>
							</Col>
							<Col l={4} m={3} s={12}>
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
								</Card>
							</Col>
							<Col l={4} m={3} s={12}>
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
								</Card>
 							</Col>
							<Col l={4} m={3} s={12}>
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
								</Card>
 							</Col>
							<Col l={4} m={3} s={12}>
								<Card className="public-tag-card">
									<div className="public-tag-name">Victor Lancien<br/>22 ans</div>
									<img alt="profile" className="public-tag-img" src="img/yuna.jpg"/>
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
