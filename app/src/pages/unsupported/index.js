import React, { Component } from 'react';
import { Col, Card, Row } from 'react-materialize';

import '../../index.css';
import './index.css';

import {logoName} from '../../config/crushyard'
import $ from 'jquery';

class NotSupported extends Component {
	componentDidMount() {
		document.title =  `${logoName} - Not Supported`;

		$('body').addClass('loaded');

	}
	render() {
		return (
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='NOT SUPPORTED WEBSITE'>PLEASE ALLOW localStorage OR CHANGE NAVIGATOR</Card>
						</Col>
					</Row>
				</div>
		);
	}
}

export default NotSupported;
