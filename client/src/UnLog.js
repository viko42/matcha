import React, { Component } from 'react';
import { Link } from 'react-router'
import CheckToken from './auth'
import logo from './logo.svg';
import Header from './Header';
import './App.css';
import GetToken from './test'

class UnLog extends Component {
	state = {
		error: "",
		ready: false
	}
	async componentDidMount() {
		console.log("Check de la connexion");
		const test = new GetToken();
		let res = await test.getTokenx();
		if (res === true) {
			console.log("Check de la connexion OK");
			this.setState({
				ready: true
			});
		}
	}
	handleClick() {
		console.log("Deconnexion");
		localStorage.clear();
		console.log("Le token est maintenant a ");
		console.log(localStorage.getItem('token'));
		this.setState({
			ready: false
		});
	}
	render() {
	  return (
		<div className="App">
		<Header/>
		{this.state.ready === true &&
			<div className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h2>CONNECTE</h2>
				<h2>{this.state.error}</h2>
			</div>
		}
		{this.state.ready &&<div className="Deco">
			<button onClick={this.handleClick.bind(this)}>se deconnecter</button>
		</div>}
			{!this.state.ready && <div className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h2>PAS CONNECTE</h2>
				<h2>{this.state.error}</h2>
			</div>}
			<Link to="/" activeStyle={ {color: 'red'} }>Retour a la page de log</Link>
		</div>
	)}
	}
export default UnLog;
