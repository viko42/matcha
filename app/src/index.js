import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'

import Routes from './config/routes';

ReactDOM.render((
  	<HashRouter>
		<Routes />
	</HashRouter>
), document.getElementById('root'))

console.log('App Started');
registerServiceWorker();
