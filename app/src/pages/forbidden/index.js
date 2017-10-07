import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Forbidden extends Component {
	componentDidMount() {
		document.title = "CrushYard - Forbidden";
	}
	render() {
		return (
			<div>
				<Header />
				<SideBar />
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='502 FORBIDDEN'>LIMITED ACCESS</Card>
						</Col>
					</Row>
				</div>
				<Footer/>
			</div>
		);
	}
}

export default Forbidden;
