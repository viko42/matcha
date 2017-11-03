import React, { Component } from 'react';
import { Col, Card, Row, Input, Button } from 'react-materialize';
import { Link, Redirect} from 'react-router-dom';
import swal from 'sweetalert';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'
import io from "socket.io-client";

import {getLocalStorage, setLocalStorage} from '../../config/policies'

const { apiUrl } = require('../../config/crushyard');


class Login extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	constructor(props) {
		super(props);

		this.state = {
			errors: {},
			response: false,
	        endpoint: apiUrl
		};

		this.login = this.login.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	componentDidMount() {
		document.title = `${logoName} - Login`;
	}
	componentWillMount() {
	    this.initialState = this.state
	}
	handleInputChange(event) {
		const target = event.target, name = target.name, value = target.value;

		this.setState({
			[name]: value
		});
	}
	login(e) {
		e.preventDefault();
		const self = this;

		services('loginUser', self.state, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			setLocalStorage('auth', response.data.token);
			setLocalStorage('user', response.data.data);

			global.socket = io.connect(apiUrl, {
				query: {token: getLocalStorage('auth')}
			});
			// global.socket.on('connect_error', function(err) {
			//   console.log('Error connecting to server 2');
			// // window.location.assign(urlApp + "/#/home");
			// });

			swal("Summary", "Successfully connected !", "success");
			self.setState({redirect: true});
		});
	}
	ifConnected() {
		if (!getLocalStorage('auth'))
			return (
				<Header>
					<div className="content">
						<Row>
							<form onSubmit={this.login}>
								<Col m={12} s={12}>
									<Card title="Vos données de connexion">
										<Row>
											<Input type="text" name='login' label="Your email or username" error={this.state.errors && this.state.errors.login ? this.state.errors.login : null} onChange={this.handleInputChange} s={12}/>
											<Input type="password" name='password' label="Your password" error={this.state.errors.password ? this.state.errors.password : null} onChange={this.handleInputChange} s={12} />
											<Col s={12}><Link to="/reset" className="pull-right">Mot de passe oublié</Link></Col>
											<Col s={12}><Button className="pull-left" waves='light'>LOGIN</Button></Col>
										</Row>
									</Card>
								</Col>
							</form>
						</Row>
					</div>
				</Header>
			);
		else
			return (
				<Header>
					<div className="content">
						<Row>
							<form onSubmit={this.login}>
								<Col m={12} s={12}>
									<Card title="Vous êtes déjà connecté"></Card>
								</Col>
							</form>
						</Row>
					</div>
				</Header>
			);
	}
	render() {
		if (this.state.redirect)
			return <Redirect to="/" />;
		return this.ifConnected();
	}
}

export default Login;
