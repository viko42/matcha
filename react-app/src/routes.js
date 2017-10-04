import React from 'react';
import {Switch,Route} from 'react-router-dom';

import App from './App';
import Profile from './pages/profile/profile';

const Routes = (props) => (
	<Switch>
      <Route exact path='/' component={App}/>
      <Route path='/profile' component={Profile}/>
    </Switch>
);

export default Routes;
