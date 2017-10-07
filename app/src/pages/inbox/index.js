import React, { Component } from 'react';
import { Col, Card, Row, Collapsible, CollapsibleItem, Chip, Icon, Input, Button } from 'react-materialize';

import '../../index.css';
import './index.css';

import swal	from 'sweetalert';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Inbox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			messageLog: [],
			messages: [
				{
					'sender': "0",
					'content': "Bonjour",
					'date': '0000-00-00'
				},
				{
					'sender': "1",
					'content': "te",
					'date': '0000-00-00'
				},
				{
					'sender': "1",
					'content': "te",
					'date': '0000-00-00'
				},
				{
					'sender': "1",
					'content': "te",
					'date': '0000-00-00'
				},
				{
					'sender': "1",
					'content': "te",
					'date': '0000-00-00'
				}
			]
		};
		for (var i = 0; i < this.state.messages.length; i++) {
			this.state.messageLog.push(<p key={i} className={this.state.messages[i].sender === '1' ? 'me' : 'them'}>{this.state.messages[i].content}</p>);
		}
		console.log(this.state.messageLog);
	}
	componentDidMount() {
		document.title = "Inbox";
	}
	deleteMessageInbox() {
		swal({
			title: "Delete this conversation ?",
			text: "You will delete this conversation for ever",
			type: "warning",
			buttons: {
				cancel: true,
				confirm: true,
			},
		});
	}
	render() {
		return (
			<div>
				<Header />
				<SideBar />
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Inbox page'>All your inbox messages</Card>
						</Col>
						<Col m={12} s={12}>
							<Collapsible accordion>
								<CollapsibleItem header={<div><Chip>
									<img src='img/yuna.jpg' alt='Contact Person' />
									Jane Doe
								</Chip><a onClick={this.deleteMessageInbox} className="pull-right deleteMessageInbox"><Icon>delete_forever</Icon></a></div>}>
									{this.state.messageLog}
									<Row>
										{/* <Col m={12} s={12}> */}
										<Input type="text" label="Write here to answer" s={12}/>
										<Col s={12}>
											<Button>SEND</Button>
										</Col>
									</Row>
								</CollapsibleItem>
								<CollapsibleItem header='Second' icon='place'>
									Lorem ipsum dolor sit amet.
								</CollapsibleItem>
								<CollapsibleItem header='Third' icon='whatshot'>
									Lorem ipsum dolor sit amet.
								</CollapsibleItem>
							</Collapsible>
						</Col>
					</Row>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Inbox;
