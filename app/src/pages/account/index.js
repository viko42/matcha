import React, { Component }				from 'react';
import {	Col,	Card,	Row,
			Input,	Button,	Preloader }	from 'react-materialize';
import services							from '../../config/services';
import swal								from 'sweetalert';
import $								from 'jquery';

import '../../index.css';
import './index.css';

import Header				from '../../components/header'
import {logoName}	from '../../config/crushyard'

import {setLocalStorage, getLocalStorage}	from '../../config/policies'
import Geolocation			from "react-geolocation";
import Geosuggest			from 'react-geosuggest';

class Account extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = { account: {}, errors: {}, ...getLocalStorage('user') };
		this.updateAccount		= this.updateAccount.bind(this);
		this.handleInputChange	= this.handleInputChange.bind(this);
	}
	componentWillUnmount() {
		this._isMount = false;
	}
	componentWillMount() {
		services('verifyToken', {token: getLocalStorage('auth')}, function (err, response) {
			if (err)
				return window.location.reload();
		});
	}
	componentDidMount() {
		document.title = `${logoName} - Account`;
		const self = this;

		services('getAccount', {}, function (err, response) {
			if (!self._isMount)
				return ;

			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.setState({account: response.data.account});
		})
	}
	saveLocalization(position) {
		this.setState({position: position});
	}
	updateAccount() {
		const self = this;

		services('updateAccount', self.state, function(err, response) {
			if (!self._isMount)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			setLocalStorage('user', response.data.data);
			$('#password').val('');
			swal("Your acccount informations", "Successfully updated !", "success");
			self.forceUpdate();
			// self.props.history.push('/');
		});
	}
	handleInputChange(event) {
		const target = event.target, name = target.name, value = target.value;

		this.setState({
			[name]: value
		});
	}
	updateLocalization () {
		const self = this;

		services('updateLocalization', self.state, function (err, response) {
			if (!self._isMount)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			swal("Your localization informations", "Successfully updated !", "success");
			self.forceUpdate();
		});
	}
	onSuggestSelect(suggest) {
		this.setState({localization: {lat: suggest.location.lat, lng: suggest.location.lng}});
	}
	findMe() {
		const self = this;

		this.setState({localization: {myLocation: true, lng: this.state.position ? this.state.position.coords.longitude : null, lat: this.state.position ? this.state.position.coords.latitude : null}}, function () {
			self.updateLocalization();
		});
	}
	render() {
		const { account } = this.state;
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title="Edit your account">
								{this.state.account && this.state.account.email && <Row>
									<Input type="text"  name='firstName' label="Your firstName" defaultValue={this.state.firstName}  onChange={this.handleInputChange} s={12} />
									<Input type="text"  name='lastName' label="Your lastName" defaultValue={this.state.lastName}  onChange={this.handleInputChange} s={12} />
									<Input type="email"  name='email' label="Your email" defaultValue={this.state.account.email} onChange={this.handleInputChange} s={12}/>
									<Input type="password" ref={el => this.inputPassword = el} name='password' id='password' label="Your password" onChange={this.handleInputChange} s={12} />
								</Row>
								}
								{this.state.account && !this.state.account.email && <Row>
									<Col s={12}>
										<center><Preloader size='big'/></center>
									</Col>
								</Row>
								}

								{this.state.account && this.state.account.birth && <Row>
									<Input type="text"  name='birth' label="Date de naissance" defaultValue={this.state.account.birth} s={12} disabled/>
									<Input id="phone" type="text" name='phone' label="Your phone number" defaultValue={this.state.phone} onChange={this.handleInputChange} s={12} />
									<Col s={12}>
										<Button className="pull-right" onClick={this.updateAccount}>Update</Button>
									</Col>
								</Row>
								}
								{this.state.account && !this.state.account.email && <Row>
									<Col s={12}>
										<center><Preloader size='big'/></center>
									</Col>
								</Row>
								}
							</Card>

							<Card title="Change your localization">
								<Geolocation onSuccess={this.saveLocalization.bind(this)} />

								<Row>
									<a onClick={this.findMe.bind(this)}>Find my position</a>
									<Geosuggest
										// googleMaps=
										onSuggestSelect={this.onSuggestSelect.bind(this)}
										initialValue={account ? account.adress : ''}
									/>
								<Col s={12}>
									<Button className="pull-right" onClick={this.updateLocalization.bind(this)}>Change</Button>
								</Col>
							</Row>
							</Card>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Account;
