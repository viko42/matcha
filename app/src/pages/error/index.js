import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';
import { Link } from 'react-router-dom';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Error extends Component {
	componentDidMount() {
		document.title = "CrushYard - 404 Not found";
	}
	render() {
		return (
			<div>
				<Header />
				<SideBar />
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='404 NOT FOUND'>Page inexistante
								<p><Link to="/">Cliquez ici pour retourner sur la page d'accueil</Link></p>
							</Card>
						</Col>
					</Row>
				</div>
				<Footer/>
			</div>
		);
	}
}

export default Error;
