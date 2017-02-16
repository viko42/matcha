import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import React, { Component } from 'react'
import './login.css'
// import HeaderFull from '../../header-menu/header'
import axios from 'axios'

class ForgotMdp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
		}
		this.alertOptions = {
			offset: 14,
			position: 'bottom right',
			theme: 'dark',
			time: 5000,
			transition: 'scale'
		};
    this.handleInputChange = this.handleInputChange.bind(this);
	}
	showAlert(){
		this.msg.info("message", {
			time: 2000,
			type: 'success',
			icon: <img src="img/success.png" alt=""/>
		});
		// this.msg.error("message", {time: 2000,type: 'error',icon: <img src="img/error.png" alt="" />});
		// this.msg.info("message", {time: 2000,type: 'info',icon: <img src="img/info.png" alt="" />});
	}

	componentDidMount() {
		document.title = "Forgot - Matcha";
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
		const regObj = { email: event.target.email.value }

		if (!regObj.email) {
			this.messageInfo('Champs manquant(s)')
			return ;
		}
		axios({
		  method: 'post',
		  url: 'http://localhost:8080/forgot',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		  data: {
		    ...regObj
		  }
		}).then((res) => {
			console.log(res.data);
			if (res.data.status === 1)
			this.messageInfo(res.data.message);
			else
			this.messageInfo(res.data.message);
		}).catch((err, res) => {
			this.messageInfo('Erreur de connexion');
		});
	}

	handleSubmitRCode(event) {
	  event.preventDefault();
		  const regObj = { email: event.target.email.value, code: event.target.rcode.value,
		   					newpass: event.target.newpass.value, newpassbis: event.target.newpassbis.value }

		  if (!regObj.email || !regObj.code || !regObj.newpass || !regObj.newpassbis) {
			  this.messageInfo('Champs manquant(s)')
			  return ;
		  }
		  axios({
			method: 'post',
			url: 'http://localhost:8080/forgot/new',
			  headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
			  },
			data: {
			  ...regObj
			}
		  }).then((res) => {
			  console.log(res.data);
			  if (res.data.status === 1)
			  	this.messageInfo(res.data.message);
			  else
			  	this.messageInfo(res.data.message);
		  }).catch((err, res) => {
			  this.messageInfo('Erreur de connexion');
		  });
	  }
	messageInfo = (msg) => {
		this.setState({ message: msg })
		this.msg.info(msg);
		setTimeout(() => {
			this.setState({ message: '' })
		}, 10000)
	}

	render() {
		return (
			<div className="Login">
				<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
				<div className="Login-content">
				<center>
			  	<Link to="/login">Retour</Link>
				<h2>Mot de passe oublié</h2>
				  	<form className="Login-form" onSubmit={this.handleSubmit.bind(this)}>
			  	  		<label>
							<input type="email" name="email" onChange={this.handleInputChange} placeholder="Email"/><br/>
			  			</label>
					<input type="submit" name="submit" /><br/>
					</form>
			  	{this.state.message}
				<h2>Changement du mot de passe</h2>
				  	<form className="Login-form" onSubmit={this.handleSubmitRCode.bind(this)}>
			  	  		<label>
							<input type="email" name="email" onChange={this.handleInputChange} placeholder="Email"/><br/>
							<input type="text" name="rcode" onChange={this.handleInputChange} placeholder="Code"/><br/>
							<input type="password" name="newpass" onChange={this.handleInputChange} placeholder="Nouveau mot de passe"/><br/>
							<input type="password" name="newpassbis" onChange={this.handleInputChange} placeholder="Confirmation Nouveau mot de passe"/><br/>
			  			</label>
					<input type="submit" name="submit" /><br/>
					</form>
        		</center>
				</div>
			</div>
		);
	}
}


export default ForgotMdp;
