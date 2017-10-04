import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'
import './App.css';

import Routes from './routes';

ReactDOM.render((
  <HashRouter>
    <Routes />
  </HashRouter>
), document.getElementById('root'))

registerServiceWorker();
