import React, { Component } from 'react';
import { Col, Card, Row, Input, Button, Icon } from 'react-materialize';
import swal from 'sweetalert';
import services, { GoogleApi } from '../../config/services';

import Geolocation				from "react-geolocation";
// import { compose, withProps } from "recompose"
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'


// const MyMapComponent = compose(
// 	withProps({
// 		googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
// 		loadingElement: <div style={{ height: `100%` }} />,
// 		containerElement: <div style={{ height: `400px` }} />,
// 		mapElement: <div style={{ height: `100%` }} />,
// 	}), withScriptjs, withGoogleMap)((props) =>
// 	<GoogleMap defaultZoom={8} defaultCenter={{ lat: self.state.position.coords.latitude, lng: self.state.position.coords.longitude }}>
// 		{props.isMarkerShown && <Marker position={{ lat: self.state.position.coords.latitude, lng: self.state.position.coords.longitude }} onClick={props.onMarkerClick} />}
// 	</GoogleMap>
// );

class Register extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	constructor(props) {
		super(props);

		this.state = {
			email: null,
			password: null,
			confirmpass: null,
			firstName: null,
			lastName: null,
			phone: null,
			birth: null,
			errors: {}
		};

		this.validation = this.validation.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	componentDidMount() {
		document.title = `${logoName} - Register`;
		// this.delayedShowMarker();
	}
	componentWillMount() {
	    this.initialState = this.state
	}
	// delayedShowMarker = () => {
	// 	setTimeout(() => {
	// 		this.setState({ isMarkerShown: true })
	// 	}, 3000)
	// }

	// handleMarkerClick = () => {
	// 	this.setState({ isMarkerShown: false })
	// 	this.delayedShowMarker()
	// }
	handleInputChange(event, data) {
		const target = event.target, name = target.name, value = target.value;

		this.setState({
			[name]: value
		});
	}
	saveLocalization(position) {
		this.setState({position: position});
	}
	validation(e) {
		e.preventDefault();
		const self = this;

		GoogleApi('findPosition', self.state.position ? {getData: self.state.position.coords.latitude+','+self.state.position.coords.longitude} : {}, function (err, response) {
			if (response && response.data && response.data.results && response.data.results[0])
				self.setState({localization: response.data.results[0].geometry.location});
			services('createUser', self.state, function (err, resp) {
				if (err) {
					self.setState({errors: resp.data.errors})
					if (resp.data.errors.swal)
						swal("Error", resp.data.errors.swal, "error");
					return ;
				}
				swal("Summary", "Successfully registered !", "success");
				self.props.history.push('/');
			});
		});
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Inscription à CrushYard'>Inscrivez-vous dès maintenant sur CrushYard<p/></Card>
						</Col>
						<form onSubmit={this.validation}>
							<Col m={12} s={12}>
								<Card title="Vos données de connexion">
									<Row>
										<Input type="email" name='email' label="Your email" error={this.state.errors && this.state.errors.email ? this.state.errors.email : null} onChange={this.handleInputChange} s={12}/>

										<Input type="password" name="password" label="Your password" error={this.state.errors.password ? this.state.errors.password : null} onChange={this.handleInputChange} s={6} />
										<Input type="password" name="confirmpass" label="Retype your password" error={this.state.errors.confirmpass ? this.state.errors.confirmpass : null} onChange={this.handleInputChange} s={6}/>
									</Row>
								</Card>
							</Col>
							<Col m={12} s={12}>
								<Card title="Informations personelles">
									<Row>
										{/* <Input name='sexe' type='radio' value='homme' label='Homme' m={6} s={6} onChange={this.handleInputChange} validate/>
										<Input name='sexe' type='radio' value='femme' label='Femme' m={6} s={6} onChange={this.handleInputChange}/> */}
										<Input name='username' s={12} label="Nom d'utilisateur" validate error={this.state.errors.username ? this.state.errors.username : null} onChange={this.handleInputChange}><Icon>account_circle</Icon></Input>
										<Input name='lastName' s={6} label="Last Name" validate error={this.state.errors.lastName ? this.state.errors.lastName : null} onChange={this.handleInputChange}><Icon>account_circle</Icon></Input>
										<Input name='firstName' s={6} label="First Name" validate error={this.state.errors.firstName ? this.state.errors.firstName : null} onChange={this.handleInputChange}></Input>
										<Input name='phone' s={6} label="Telephone" validate type='tel' error={this.state.errors.phone ? this.state.errors.phone : null} onChange={this.handleInputChange}><Icon>phone</Icon></Input>
										<Input name='birth' type='date' label="Date de naissance" options={{selectYears:100, today: 'today'}} error={this.state.errors.birth ? this.state.errors.birth : null} onChange={this.handleInputChange} m={6} s={6}/>
									</Row>
								</Card>
							</Col>
							<Col m={12} s={12}>
								<Geolocation onSuccess={this.saveLocalization.bind(this)} />
							</Col>

							<Col m={12} s={12}>
								{this.props.result}
								<Button large className="pull-right" waves='light' type="submit">VALIDATION</Button>
							</Col>
						</form>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Register;
