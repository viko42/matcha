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
import Crushs			from '../pages/crushs';
import Search			from '../pages/search';
import Visits			from '../pages/visits';
import Likes			from '../pages/likes';

import NotFound			from '../pages/notfound';
import Error			from '../pages/error';
import Forbidden		from '../pages/forbidden';
import NotSupported		from '../pages/unsupported';

import {getLocalStorage} from './policies'

const Authorization = function (component, roles) {
	if (!getLocalStorage('auth'))
		return Forbidden;
	return component;
}

const isConnected = function (connected, notConnected) {
	if (!getLocalStorage('auth'))
		return notConnected;
	return connected;
}

const Routes = (props) => (
	<Switch>
		<Route exact path='/'		component={isConnected(Home, HomeGuest)}/>
		<Route path='/profile/:id'	component={Authorization(Profile, ['User', 'Admin'])}/>
		<Route path='/account'		component={Authorization(Account, ['User', 'Admin'])}/>
		<Route path='/inbox'		component={Authorization(Inbox, ['User', 'Admin'])}/>
		<Route path='/crushs'		component={Authorization(Crushs, ['User', 'Admin'])}/>
		<Route path='/search'		component={Authorization(Search, ['User', 'Admin'])}/>
		<Route path='/visits'		component={Authorization(Visits, ['User', 'Admin'])}/>
		<Route path='/likes'		component={Authorization(Likes, ['User', 'Admin'])}/>

		{/* <Route path='/administration' component={Authorization(Admin, ['Admin'])}/> */}
		<Route path='/register'		component={Register}/>
		<Route path='/login'		component={Login}/>
		<Route path='/logout'		component={Logout}/>
		<Route path='/unsupported'	component={NotSupported}/>
		<Route path='/maintenance'	component={Error}/>
		<Route component={NotFound}/>
    </Switch>
);

export default Routes;
