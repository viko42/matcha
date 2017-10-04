import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import GetMuiTheme from 'material-ui/styles/GetMuiTheme'
import AppBar from 'material-ui/AppBar';

class App extends Component {
  render() {
    return (
		<MuiThemeProvider>
			<AppBar
			iconClassNameRight="muidocs-icon-navigation-expand-more">
			</AppBar>
		</MuiThemeProvider>

    );
  }
}

export default App;
