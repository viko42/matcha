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

class Account extends Component {
	constructor(props) {
		super(props);

		this.state = { errors: {}, ...JSON.parse(localStorage.getItem('user'))};
		this.updateAccount		= this.updateAccount.bind(this);
		this.handleInputChange	= this.handleInputChange.bind(this);
	}
	componentDidMount() {
		document.title = `${logoName} - Account`;
	}
	updateAccount() {
		const self = this;

		services('updateAccount', self.state, function (err, response) {

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
	render() {
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
									<Input type="text" name='birthday' label="Your birthday date" defaultValue={this.state.birth} s={12} disabled/>
									<Input id="phone" type="text" name='phone' label="Your phone number" defaultValue={this.state.phone} onChange={this.handleInputChange} s={12} />
									<Col s={12}>
										<Button className="pull-right" onClick={this.updateAccount}>Update</Button>
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
