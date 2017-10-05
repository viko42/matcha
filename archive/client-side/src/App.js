import React, { Component } from 'react'
import HeaderFull from './header-menu/header'
import './App.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
class App extends Component {

  render() {
    return (
		<div>
	        <HeaderFull/>
			<ReactCSSTransitionGroup
			   transitionName="example"
			   transitionEnterTimeout={500}
			   transitionLeaveTimeout={300}>
			   {this.props.children}
			 </ReactCSSTransitionGroup>
		</div>
    );
  }
}


export default App;
