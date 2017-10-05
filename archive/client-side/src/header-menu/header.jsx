import React, { Component } from 'react'
import {openNav, openSearchBar} from './nav_func'
import Header from './nav'
import NavBar from './navbar'

class HeaderFull extends Component {
	render() {
		return (
    	<div>
			<Header />
			<div className="App" id="main">
				<div id="App-header">
					<div id="App-header-hbgr" onClick={openNav}>
						<h4 className="App-header-hbgr-txt">&#8801;</h4>
					</div>
					<div id="App-header-search" onClick={openSearchBar}>
						<h4 className="App-header-searchIcon"><img src="/img/searchIcon.png" id="img-icon-search" height="22" width="22" alt="" /></h4>
					</div>
					<NavBar />
				</div>
			</div>
		</div>
		);
	}
}


export default HeaderFull;
