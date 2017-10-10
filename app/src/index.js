import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'

import Routes from './config/routes';
import Header from './components/header/index'
import SideBar from './components/sidebar/index'

ReactDOM.render((
  	<HashRouter>
		<div>
			{/* <Header/> */}
			{/* <SideBar/> */}
			<Routes />
		</div>
	</HashRouter>
), document.getElementById('root'))

console.log('App Started');
registerServiceWorker();
