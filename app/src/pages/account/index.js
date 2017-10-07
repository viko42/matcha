import React, { Component } from 'react';
import { Col, Card, Row, Input, Button } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Account extends Component {
	componentDidMount() {
		document.title = "Account";
	}
	render() {
		return (
			<div>
				<Header />
				<SideBar />
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title="Edit your account">
								<Row>
									<Input type="email" name='email' label="Your email" defaultValue="v.lancien@live.fr" s={12} disabled/>
									<Input type="password" name='password' label="Your password" s={12} />
									<Col s={12}>
										<Button className="pull-right">Update password</Button>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Account;
