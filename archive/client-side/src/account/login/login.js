import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import React, { Component } from 'react'
import './login.css'
import axios from 'axios'
// import HeaderFull from '../../header-menu/header'

class Login extends Component {
	constructor(props) {
		super(props);
		this.alertOptions = {
			offset: 14,
			position: 'bottom right',
			theme: 'dark',
			time: 1500,
			transition: 'scale'
		};
		this.state = {
			message: ''
		}
    	this.handleInputChange = this.handleInputChange.bind(this);
	}
	showAlert(){
		this.msg.show('Some text or component', {
	      time: 2000,
	      type: 'success',
	      icon: <img src="img/error.png" alt=""/>
	    });
		// this.msg.show('Some text or component', {
		//   time: 2000,
		//   type: 'success',
		//   icon: <img src="img/error.png" />
		// });
		// this.msg.error("message", {time: 2000,type: 'error',icon: <img src="img/error.png" alt="" />});
		// this.msg.show("message", {time: 2000,type: 'show',icon: <img src="img/show.png" alt="" />});
	}
	componentDidMount() {
		document.title = "Login - Matcha";
	}
	handleInputChange(event) {
		const target = event.target,
		name = target.name,
		value = target.value;

		this.setState({
			[name]: value
		});
	}
	handleSubmit(event) {
		event.preventDefault();
		const regObj = {email: event.target.email.value,pass: event.target.pass.value}

		const _this = this;
		if (!regObj.email || !regObj.pass) {
			this.msg.show('Champs manquant(s)')
		}
		axios({
			method: 'post',
			url: 'http://localhost:8080/login',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			data: {
				...regObj
			}
		}).then((res) => {
			console.log(res.data);
			if (res.data.status === true) {
				this.msg.show(res.data.message);
				localStorage.setItem('token', res.data.userReg.token);
				localStorage.setItem('id', res.data.userReg.id);
				// localStorage.getItem('token');
				setTimeout(() => {
					this.props.router.push('/')
				}, 3000)

			}
			else
				this.msg.show(res.data.message);
		}).catch((err, res) => {
			_this.msg.show('Erreur de connexion');
		});
	}
	messageInfo = (message) => {
		this.setState({ message })
		this.msg.show( message );
		setTimeout(() => {
			this.setState({ message: '' })
		}, 10000)
	}
	render() {
		return (
			<div className="Login">
				<AlertContainer ref={(a) => this.msg = a} {...this.alertOptions} />
				<div className="Login-content">
					<center>
						<Link to="/">Retour</Link><h2>Connexion</h2>
	          			<form className="Login-form" onSubmit={this.handleSubmit.bind(this)}>
	            			<label>
								<input type="email" name="email" onChange={this.handleInputChange} placeholder="Email"/><br/>
								<input type="password" name="pass" onChange={this.handleInputChange} placeholder="Mot de passe"/><br/>
								<Link to="/forgot"><div className="Login-ForgotMdp">Mot de passe oublie ?</div></Link>
	            			</label>
							<input type="submit" name="submit" /><br/>
	          			</form>
						{this.state.message}
        			</center>
				</div>
  			</div>
		);
	}
}

export default Login;
