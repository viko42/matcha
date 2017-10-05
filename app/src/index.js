import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'

import Header from './components/header/index'
import SideBar from './components/sidebar/index'
import Footer from './components/footer/index'
import Routes from './config/routes';

ReactDOM.render((
	<div>
		<Header />
		<SideBar />
	  	<HashRouter>
			<Routes />
		</HashRouter>
		<Footer />
	</div>
), document.getElementById('root'))

console.log('App Started');
registerServiceWorker();
