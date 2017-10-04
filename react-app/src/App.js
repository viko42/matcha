import React, { Component } from 'react';
import './App.css';

import { Col, Card, Row } from 'react-materialize';
import Header from './header/index'
import SideBar from './sidebar/index'
import Footer from './footer/index'
import {Link} from 'react-router-dom';

class App extends Component {
  render() {
    return (
		<div>
			<Header />
			<SideBar />
			<div className="content">
				<Row>
					<Col m={12} s={12}>
						<Card title='S'>Welcome to the home page.
							<Link to="/profile">Here</Link>
						</Card>
					</Col>
					<Col m={6} s={6}>
						<Card title='T'>Welcome to the home page.</Card>
					</Col>
					<Col m={6} s={6}>
						<Card title='T'>Welcome to the home page.</Card>
					</Col>
					<Col m={4} s={4}>
						<Card title='E'>Welcome to the home page.</Card>
					</Col>
					<Col m={4} s={4}>
						<Card title='S'>Welcome to the home page.</Card>
					</Col>
					<Col m={4} s={4}>
						<Card title='S'>Welcome to the home page.</Card>
					</Col>
					<Col m={12} s={12}>
						<Card title='S'>Welcome to the home page.</Card>
					</Col>
					<Col m={12} s={12}>
						<Card title='S'>Welcome to the home page.</Card>
					</Col>
			</Row>
			</div>
			<Footer />
			{/* <Footer copyrights="Copyright 2017"/> */}
		</div>
    );
  }
}

export default App;

// <MuiThemeProvider>
// 	<AppBar
// 		iconClassNameRight="muidocs-icon-navigation-expand-more">
// 	</AppBar>
// </MuiThemeProvider>
