import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'
// import socketIOClient from "socket.io-client";

import Routes from './config/routes';
// import App from './App';

ReactDOM.render((
  	<HashRouter>
		{/* <App/> */}
		<Routes />
	</HashRouter>
), document.getElementById('root'))

console.log('App Started');
registerServiceWorker();
