import React, { Component } from 'react';
import '../../index.css';
import Maps from './maps'

import Header from '../../components/header'
import {logoName} from '../../config/crushyard'

class MapsUsers extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	componentDidMount() {
		document.title = `${logoName} - Maps`;
	}
	render() {
		return (
			<Header>
				<Maps></Maps>
			</Header>
		);
	}
}

export default MapsUsers;
