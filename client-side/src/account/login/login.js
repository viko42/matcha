import AlertContainer from 'react-alert'
import { Link } from 'react-router'
import React, { Component } from 'react'
import './login.css'
// import HeaderFull from '../../header-menu/header'
import axios from 'axios'

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
      isFocus: 'Phone',
      created: false,
			message: '',
			event: []
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
		const regObj = { name: event.target.name.value,
											firstname: event.target.firstname.value,
											email: event.target.email.value,
											pass: event.target.pass.value,
	    								passconfirm: event.target.passconfirm.value}

		if (!regObj.name || !regObj.firstname || !regObj.email || !regObj.email || !regObj.pass || !regObj.passconfirm) {
			this.messageInfo('Champs manquant(s)')
			return ;
		}
		axios({
		  method: 'post',
		  url: 'http://localhost:8080/register',
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
