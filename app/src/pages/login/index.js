import React, { Component } from 'react';
import { Col, Card, Row, Input, Button } from 'react-materialize';
import { Link, Redirect} from 'react-router-dom';
import swal from 'sweetalert';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

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
			localStorage.setItem('auth', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.data));
			swal("Summary", "Successfully connected !", "success");
			self.setState({redirect: true});
		});
	}
	ifConnected() {
		if (!localStorage.getItem('auth'))
			return (
				<div>
					<Header />
					<SideBar />
					<div className="content">
						<Row>
							<form onSubmit={this.login}>
								<Col m={12} s={12}>
									<Card title="Vos données de connexion">
										<Row>
											<Input type="email" name='email' label="Your email" error={this.state.errors && this.state.errors.email ? this.state.errors.email : null} onChange={this.handleInputChange} s={12}/>
											<Input type="password" name='password' label="Your password" error={this.state.errors.password ? this.state.errors.password : null} onChange={this.handleInputChange} s={12} />
											<Col s={12}><Link to="/" className="pull-right">Mot de passe oublié</Link></Col>
											<Col s={12}><Button className="pull-left" waves='light'>LOGIN</Button></Col>
										</Row>
									</Card>
								</Col>
							</form>
						</Row>
					</div>
					<Footer/>
				</div>
			);
		else
			return (
				<div>
					<Header />
					<SideBar />
					<div className="content">
						<Row>
							<form onSubmit={this.login}>
								<Col m={12} s={12}>
									<Card title="Vous êtes déjà connecté"></Card>
								</Col>
							</form>
						</Row>
					</div>
					<Footer />
				</div>
			);
	}
	render() {
		if (this.state.redirect)
			return <Redirect to="/" />;
		return this.ifConnected();
	}
}

export default Login;
