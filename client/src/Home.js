import React, { Component } from 'react'
import { Link } from 'react-router'
import CheckToken from './auth'
import Header from './Header'
import GetToken from './test'
import './App.css'
import './menu.css'

// import axios from 'axios'
// import CheckToken from './auth'
// import { Router, Route, } from 'react-router'
// import logo from './logo.svg';
// import LogIn from './App'
// import { Link } from 'react-router'

function w3_open() {
  document.getElementById("main").style.marginLeft = "25%";
  document.getElementById("mySidenav").style.width = "25%";
  document.getElementById("mySidenav").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidenav").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
class Side extends Component {
	render() {
		return (
			<div id="main">
			<nav className="w3-sidenav w3-white w3-card-2 w3-animate-left" style={{display : 'none'}} id="mySidenav">
			  <a href="javascript:void(0)"
			  onClick={w3_close}
			  className="w3-closenav w3-large">Close &times;</a>
			  <a href="#">Link 1</a>
			  <a href="#">Link 2</a>
			  <a href="#">Link 3</a>
			  <a href="#">Link 4</a>
			  <a href="#">Link 5</a>
			</nav>
			<header class="w3-container w3-teal">
			  <span class="w3-opennav w3-xlarge" onclick="w3_open()" id="openNav">&#9776;</span>
			  <Header />

			</header>
			</div>
		)
	}
}

class Home extends Component {
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
	render() {
		return (
			<div className="App">
				<button onClick={w3_open}>Test</button>
				<Side />
				{this.state.ready &&
					<div className="Content">
						<h1>Accueil</h1>
						<p className="App-intro">
							<code>Vous etes bien connecte</code>
						</p>
					</div>
				}
				{!this.state.ready &&
					<div>

					<h1>Accueil</h1>
					<p className="App-intro" >
						<code>Connectez-vous !</code>
					</p>
				</div>

				}
			</div>
		)
	}
}

module.exports = Home;
