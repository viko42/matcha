import React, { Component } from 'react';
import './App.css';
import './menu.css';
import { Link } from 'react-router'
import Header from './Header';
// import logo from './logo.svg';

// import axios from 'axios'
//
// class NameForm extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {value: ''};
//
// 		this.handleChange = this.handleChange.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);
// 	}
//
// 	handleChange(event) {
// 		this.setState({value: event.target.value});
// 	}
//
// 	handleSubmit(event) {
// 		alert('A name was submitted: ' + this.state.value);
// 		event.preventDefault();
// 	}

	// render() {
		// return (
			// <form onSubmit={this.handleSubmit}>
			// 	<label>
			// 		Name:
			// 		<input type="text" value={this.state.value}  onChange={this.handleChange}/>
			// 	</label>
			// 	<input type="submit" value="Submit" />
			// 	<Link to="/about" activeStyle={ {color: 'red'} }>REACT 2 !!!</Link>
			// </form>
		// );
	// }
// }
// function ActionLink() {
// 	function handleClick(e) {
// 		e.preventDefault();
// 		console.log('The link was clicked.');
// 	}
// 	return (
// 		<a href="#" onClick={handleClick}>
// 			Click me
// 		</a>
// 	);
// }
// class Menu extends React.Component {
// 	render() {
// 		return (
// 		<h1>Simple SPA</h1>
// 		<ul className="header">
// 			<li>Home</li>
// 			<li>Stuff</li>
// 			<li>Contact</li>
// 		</ul>
// 		)
// 	}
// }

// var TodoList = React.createClass({
// 	getInitialState: function() {
// 		return {
// 			token: this.props.todos
// 		};
// 	}
// })

class App extends Component {
  render() {
    return (
		<div className="App">
			<Header />
			<h1>Accueil</h1>
			<p className="App-intro">
				<code>Connectez-vous !</code>
				{/* <Content /> */}
			</p>
		</div>
	)
  }
}



module.exports = App;
// module.exports = LogIn;
// export default Header;
// export default App;
// export Header;
