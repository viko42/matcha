import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header'
import {logoName} from '../../config/crushyard'

class Error extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	componentDidMount() {
		document.title = `${logoName} - 503 Maintenance`;
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='503 MAINTENANCE'>Erreur serveur</Card>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Error;
