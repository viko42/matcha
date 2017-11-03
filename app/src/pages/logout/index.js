import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import '../../index.css';
import './index.css';

import swal from 'sweetalert';
import {logoName} from '../../config/crushyard'
import {remLocalStorage}	from '../../config/policies'

class Logout extends Component {
	_isMount = true;
	componentDidMount() {
		document.title = `${logoName} - Loggin off`;
	}
	componentWillUnmount() {
		remLocalStorage('user');
		remLocalStorage('auth');
		swal("Logged off", "Successfully disconnected !", "success");
		this._isMount = false;
	}
	render() {
		return <Redirect to="/" />;
	}
}

export default Logout;
