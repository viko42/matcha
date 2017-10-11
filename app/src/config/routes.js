import React			from 'react';
import {Switch,Route}	from 'react-router-dom';

import Home				from '../pages/home';
import HomeGuest		from '../pages/home';

import Profile			from '../pages/profile';
import Account			from '../pages/account';
import Login			from '../pages/login';
import Logout			from '../pages/logout';
import Register			from '../pages/register';
import Inbox			from '../pages/inbox';

import NotFound			from '../pages/error';
import Forbidden		from '../pages/forbidden';

const Authorization = function (component, roles) {
	if (!localStorage.getItem('auth'))
		return Forbidden;
	return component;
}

const isConnected = function (connected, notConnected) {
	console.log('isConnected method');
	// return component;
	if (localStorage.getItem('auth') === null)
		return notConnected;
	return connected;
}

const Routes = (props) => (
	<Switch>
		<Route exact path='/'		component={isConnected(Home, HomeGuest)}/>
		<Route path='/profile/:id'	component={Authorization(Profile, ['User', 'Admin'])}/>
		<Route path='/account'		component={Authorization(Account, ['User', 'Admin'])}/>
		<Route path='/inbox'		component={Authorization(Inbox, ['User', 'Admin'])}/>
		{/* <Route path='/administration' component={Authorization(Admin, ['Admin'])}/> */}
		<Route path='/register'		component={Register}/>
		<Route path='/login'		component={Login}/>
		<Route path='/logout'		component={Logout}/>
		<Route component={NotFound}/>
    </Switch>
);

export default Routes;
