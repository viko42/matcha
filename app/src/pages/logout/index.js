import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import '../../index.css';
import './index.css';

import swal from 'sweetalert';

class Logout extends Component {
	componentDidMount() {
		document.title = "CrushYard - Loggin off";
	}
	componentWillUnmount() {
		localStorage.removeItem('user');
		localStorage.removeItem('auth');
		swal("Logged off", "Successfully disconnected !", "success");
	}
	render() {
		return <Redirect to="/" />;
	}
}

export default Logout;
