import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

// import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'

class Limited extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	componentDidMount() {
		document.title =  `${logoName} - Limited`;
	}
	render() {
		return (
			<div className="content">
				<Row>
					<Col m={12} s={12}>
						<Card title='BAD GATWAY'>INTERNET ???</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Limited;
