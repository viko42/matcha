import React, { Component } from 'react';
import { Col, Card, Row, Input, Button, Icon, ProgressBar } from 'react-materialize';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import services from '../../config/services';

import '../../index.css';
import './index.css';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errors: {}
		};

		this.login = this.login.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	componentDidMount() {
		document.title = "Login";
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
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			console.log(response);
			// self.props.router.push('/home')
			swal("Summary", "Successfully connected !", "success");
			// self.props.history.push('/');
		});
	}
	render() {
		return (
			<div className="content">
				<Row>
					{/* <Col m={12} s={12}>
						<Card title='Inscription à CrushYard'>Connexion sur CrushYard<p/></Card>
					</Col> */}
					<form onSubmit={this.login}>
						<Col m={12} s={12}>
							<Card title="Vos données de connexion">
								<Row>
									<Input type="email" name='email' label="Your email" error={this.state.errors && this.state.errors.email ? this.state.errors.email : null} onChange={this.handleInputChange} s={12}/>
									<Input type="password" name='password' label="Your password" error={this.state.errors.password ? this.state.errors.password : null} onChange={this.handleInputChange} s={12} />
									<Col s={12}><Link to="/" className="pull-right">Mot de passe oublié</Link></Col>
									<Col s={12}><Button className="pull-left" waves='light'>LOGIN</Button></Col>

									{/* <ProgressBar /> */}
								</Row>
							</Card>
						</Col>
					</form>
				</Row>
			</div>
		);
	}
}

export default Login;
