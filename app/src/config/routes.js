import React from 'react';
import {Switch,Route} from 'react-router-dom';

import Home from '../pages/home';
import Profile from '../pages/profile';
import Register from '../pages/register';
import NotFound from '../pages/error';

const Routes = (props) => (
	<Switch>
		<Route exact path='/' component={Home}/>
		<Route path='/profile' component={Profile}/>
		<Route path='/register' component={Register}/>
		<Route component={NotFound}/>
    </Switch>
);

export default Routes;
