import React from 'react';
import ReactDOM from 'react-dom';

import Home from './Home';
import MyAccount from './Account/MyAccount';

import Register from './Login/Register';
import DeLog from './UnLog';
import './index.css';
import { Router, Route, hashHistory } from 'react-router'

ReactDOM.render(
	<Router history={hashHistory}>
	<Route path="/" component={Home} />
      <Route path="/deconnexion" component={DeLog}></Route>
	  <Route path="/home" component={Home}></Route>
	  {/* <Route path="/account" component={MyAccount}></Route> */}
	  <Route path="/register" component={Register}></Route>
  </Router>,
  document.getElementById('root')
);



/* <Router history={browserHistory}>
<Route path="about" component={App1}/>
		<Route path="/matcha" component={App}>
			<IndexRoute component={App1} />
			<Route path="register" component={App1} />
		</Route>
</Router>, */
