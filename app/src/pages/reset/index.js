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


class Reset extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errors: {},
			response: false,
	        endpoint: apiUrl
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.reset = this.reset.bind(this);
		this.setNewPassword = this.setNewPassword.bind(this);
	}
	componentDidMount() {
		document.title = `${logoName} - Reset`;
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
	reset(e) {
		e.preventDefault();
		const self = this;

		services('reset', self.state, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			swal("Top!", "Vérifiez vos mails!", "success");
		});
	}
	setNewPassword(e) {
		e.preventDefault();
		const self = this;

		services('resetpassword', self.state, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			swal("Succès!", "Vous venez de mettre à jour votre mot de passe!", "success");
		});
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<form onSubmit={this.reset}>
							<Col m={12} s={12}>
								<Card title="Reset de votre mot de passe">
									<Row>
										<Input type="email" name='email' label="Your email" error={this.state.errors && this.state.errors.email ? this.state.errors.email : null} onChange={this.handleInputChange} s={12}/>
										<Col s={12}><Button className="pull-left" waves='light'>RESET</Button></Col>
									</Row>
								</Card>
							</Col>
						</form>
						<form onSubmit={this.setNewPassword}>
							<Col m={12} s={12}>
								<Card title="Mettre à jour votre mot de passe">
									<Row>
										<Input type="email" name='email' label="Your email" error={this.state.errors && this.state.errors.email ? this.state.errors.email : null} onChange={this.handleInputChange} s={12}/>
										<Input type="password" name='newPass' label="Your new password" error={this.state.errors && this.state.errors.newPass ? this.state.errors.newPass : null} onChange={this.handleInputChange} s={6}/>
										<Input type="password" name='newPassC' label="Your confirmation new password" error={this.state.errors && this.state.errors.newPassC ? this.state.errors.newPassC : null} onChange={this.handleInputChange} s={6}/>
										<Input type="text" name='code' label="Your code" error={this.state.errors && this.state.errors.code ? this.state.errors.code : null} onChange={this.handleInputChange} s={12}/>
										<Col s={12}><Button className="pull-left" waves='light'>UPDATE</Button></Col>
									</Row>
								</Card>
							</Col>
						</form>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Reset;
