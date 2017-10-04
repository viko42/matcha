import React from 'react';
import {Switch,Route} from 'react-router-dom';

import App from './App';
import Profile from './pages/profile';
import NotFound from './pages/error';

const Routes = (props) => (
	<Switch>
		<Route exact path='/' component={App}/>
		<Route path='/profile' component={Profile}/>
		<Route component={NotFound}/>
    </Switch>
);

export default Routes;
