import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Router, Route, hashHistory } from 'react-router'
import App from './App'
import Profile from './account/profile'

ReactDOM.render(
	<Router history={hashHistory}>
	<Route path="/" component={App} />
      <Route path="/profile" component={Profile}></Route>
  </Router>,
  document.getElementById('root')
);
