import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import swal from 'sweetalert';
import services from '../../config/services';

export class MapContainer extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			positions: [],
			positionsRender: [],
		}

		this.listMarks = this.listMarks.bind(this);
	}
	componentDidMount() {

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

		for (var i = 0; i < positions.length; i++) {
			positionsRender.push(
				<Marker key={i} title={'This is an user.'} name={'User'} position={{lat: positions[i].lat, lng: positions[i].lng}} />
			);
		}

		this.setState({positionsRender: positionsRender});
	}
render() {
    return (
      <Map
		  google={this.props.google}
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
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWyS9AomCahBfTue98dIGMcCozwbgKBbc'
})(MapContainer)
