import React, { Component }					from 'react';
import { Col, Card, Row, Input, Button }	from 'react-materialize';
import services								from '../../config/services';
import swal									from 'sweetalert';
import $									from 'jquery';

import '../../index.css';
import './index.css';

import Header				from '../../components/header'
import {logoName}			from '../../config/crushyard'

import {setLocalStorage}	from '../../config/policies'
import Geolocation			from "react-geolocation";
import Geosuggest			from 'react-geosuggest';

class Account extends Component {
	constructor(props) {
		super(props);

		this.state = { account: {}, errors: {}, ...JSON.parse(localStorage.getItem('user'))};
		this.updateAccount		= this.updateAccount.bind(this);
		this.handleInputChange	= this.handleInputChange.bind(this);
	}
	componentDidMount() {
		document.title = `${logoName} - Account`;
		const self = this;

		console.log('Get account ?');
		services('getAccount', {}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			console.log(response.data.account);
			self.setState({account: response.data.account});
		})
	}
	saveLocalization(position) {
		this.setState({position: position});
	}
	updateAccount() {
		const self = this;

		services('updateAccount', self.state, function(err, response) {
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
		console.log('FindMe');
	}
	render() {
		const { account } = this.state;
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title="Edit your account">
								<Row>
									<Input type="text"  name='firstName' label="Your firstName" defaultValue={this.state.firstName}  onChange={this.handleInputChange} s={12} />
									<Input type="text"  name='lastName' label="Your lastName" defaultValue={this.state.lastName}  onChange={this.handleInputChange} s={12} />
									<Input type="email"  name='email' label="Your email" defaultValue={this.state.email} onChange={this.handleInputChange} s={12}/>
									<Input type="password" ref={el => this.inputPassword = el} name='password' id='password' label="Your password" onChange={this.handleInputChange} s={12} />
								</Row>
								<Row>
									<Col s={12}>
										Date de naissance: {this.state.account.birth}{!this.state.account.birth ? "Chargement..." : ''}
									</Col>
									<Input id="phone" type="text" name='phone' label="Your phone number" defaultValue={this.state.phone} onChange={this.handleInputChange} s={12} />
									<Col s={12}>
										<Button className="pull-right" onClick={this.updateAccount}>Update</Button>
									</Col>
								</Row>
							</Card>
							<Card title="Change your localization">
								<Geolocation onSuccess={this.saveLocalization.bind(this)} />

								<Row>
									<a onClick={this.findMe.bind(this)}>Find my position</a>
									<Geosuggest
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
