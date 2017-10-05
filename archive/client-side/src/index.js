import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Router, Route, hashHistory } from 'react-router'
import App from './App'
import Profile from './account/profile'
import test from './test'
import { Register, Login, ForgotMdp } from './account/'

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App} />
		<Route path="/profile" component={Profile} />
		<Route path="/register" component={Register} />
		<Route path="/login" component={Login} />
		<Route path="/forgot" component={ForgotMdp} />
		<Route path="/test" component={test} />
	</Router>
	,
	document.getElementById('root')
);
