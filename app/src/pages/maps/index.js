import React, { Component } from 'react';

import Header from '../../components/header'
import {logoName} from '../../config/crushyard'

import {Map, InfoWindow, Marker} from 'google-maps-react';
import {getLocalStorage} from '../../config/policies'

import swal from 'sweetalert';
import services from '../../config/services';

class MapContainer extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			positions: [],
			positionsRender: [],
		}

		this.listMarks = this.listMarks.bind(this);
	}
	componentWillMount() {
		services('verifyToken', {token: getLocalStorage('auth')}, function (err, response) {
			if (err)
				return window.location.reload();
		});
	}
	componentDidMount() {
		document.title = `${logoName} - Maps`;

		const self = this;

		services('getPositions', {getData: ''}, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			if (self._isMount)
				self.listMarks(response.data.positions);
		});
	}
	componentWillUnmount() {
		this._isMount = false;
	}
	listMarks(positions) {
		var positionsRender = [];

		for (var i = 0; positions && i < positions.length; i++) {
			positionsRender.push(
				<Marker key={i} title={'This is an user.'} name={'User'} position={{lat: positions[i].lat, lng: positions[i].lng}} />
			);
		}

		this.setState({positionsRender: positionsRender});
	}
	render() {
		return (
			<Header>
				<Map
					google={window.google}
					zoom={4}
					initialCenter={{
					lat: 48.8588377,
					lng: 2.27702
					}}>
					{this.state.positionsRender}
					<InfoWindow onClose={this.onInfoWindowClose}>
						<div>
							<h1>{this.state.selectedPlace && this.state.selectedPlace.name }</h1>
						</div>
					</InfoWindow>
				</Map>
			</Header>
		);
	}
}

export default MapContainer;
