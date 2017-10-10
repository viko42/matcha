import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'

class Forbidden extends Component {
	componentDidMount() {
		document.title = "CrushYard - Forbidden";
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='502 FORBIDDEN'>LIMITED ACCESS</Card>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Forbidden;
