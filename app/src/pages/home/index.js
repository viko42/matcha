import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';
import {Link} from 'react-router-dom';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class App extends Component {
	componentDidMount() {
		document.title = "Home";
	}
	ifConnected() {
		if (!localStorage.getItem('auth'))
			return (
				<div>
					<Header />
					<SideBar />
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
					<Footer/>
				</div>
			);
		else
			return (
				<div>
					<Header />
					<SideBar />
					<div className="content">
						<Row>
							<Col m={12} s={12}>
								<Card title='S'>Welcome to the home page.
									<Link to="/profile">Here</Link>
								</Card>
							</Col>
							<Col m={12} s={12}>
								<Card title='success'>Vous etes connecté en tant que:</Card>
							</Col>
						</Row>
					</div>
				</div>
			);

	}
	render() {
		return this.ifConnected();
	}
}

export default App;
