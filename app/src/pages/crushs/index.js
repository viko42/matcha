import React, { Component } from 'react';
import { Table, Col, Card, Row, Collapsible, CollapsibleItem, Chip, Icon, Input, Button } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';
import moment	from 'moment';

import Header from '../../components/header/index'
import {logoName, apiUrl} from '../../config/crushyard'

class Crushs extends Component {
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			inbox: []
		};

		// this.getMyInbox = this.getMyInbox.bind(this);
	}
	submitMessage(e) {
		e.preventDefault();

		// if (!e.target.message || e.target.message.value.length < 1)
		// 	return ;
		//
		// const send = {
		// 	message: e.target.message.value,
		// 	conversationId: e.target.conversationId.value
		// }
		//
		// global.socket.emit('send message', send);
		// e.target.message.value = "";
	}
	getMyInbox() {
		const self = this;

		services('getMyInbox', self.state, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}

			self.setState({inbox: response.data.inbox})
			self.getAllUser();
		});
	}

	componentWillMount() {
		document.title = `${logoName} - Crushs`;
	}
	componentDidMount() {
		// const self = this;
		//
		// global.socket.on('message sent', function (data) {
		// 	let index = self.giveIndexConversation(data.conversationId);
		//
		// 	if (index !== -1)
		// 		this.emit('give messages from conversation', {id: self.state.inbox[index].id, unread: false});
		// })
	}
	componentWillUnmount() {
		// global.socket.off('message sent');
	}

 // 	getAllUser() {
	// 	var messages = [], message = [];
	//
	// 	for (var i = 0; i < this.state.inbox.length; i++) {
	// 		if (this.state.inbox[i].messages.length < 1) {
	// 			message.push(
	// 				<div key={i} className="chat-bubble">
	// 					<p className='messageChat system'>
	// 						Start your chat now !
	// 					</p>
	// 				</div>
	// 			);
	// 		}
	// 		for (var m = 0; m < this.state.inbox[i].messages.length; m++) {
	// 			message.push(
	// 				<div title={moment(this.state.inbox[i].messages[m].created_at).format('DD/MM/YYYY HH:MM')} key={m} className="chat-bubble">
	// 					<p key={m} className={this.state.inbox[i].messages[m].sender === '1' ? 'messageChat me' : 'messageChat them'}>
	// 						{this.state.inbox[i].messages[m].message}
	// 					</p>
	// 					{(!this.state.inbox[i].messages[m + 1] || (this.state.inbox[i].messages[m].sender !== this.state.inbox[i].messages[m + 1].sender)) && <div className={this.state.inbox[i].messages[m].sender === '1' ? 'message-date pull-right' : 'message-date'}>
	// 						{moment(this.state.inbox[i].messages[m].created_at).format('DD/MM HH:MM')}
	// 					</div> }
	// 				</div>
	// 			);
	// 		}
	// 		messages.push(
	// 			<CollapsibleItem key={this.state.inbox[i].id}
	// 				header={
	// 					<div>
	// 						<Chip>
	// 							<img src='img/yuna.jpg' alt='Contact Person' />
	// 							{this.state.inbox[i].firstName} {this.state.inbox[i].lastName}
	// 							{this.state.inbox[i].unread > 0 && <span className="notification-bubble-chat">{this.state.inbox[i].unread}</span>}
	// 						</Chip>
	// 						<a onClick={this.deleteMessageInbox} className="pull-right deleteMessageInbox"><Icon>delete_forever</Icon></a>
	// 					</div>}>
	// 					<div id={'box-message' + i} className="myMessages">
	// 						{message}
	// 					</div>
	// 				<div className="collapsible-send">
	// 				<Row>
	// 					<form onSubmit={this.submitMessage}>
	// 						<Input type="text" name="message" label="Write here to answer" autoComplete="off" s={12} />
	// 						<Col s={12}><Button>SEND</Button></Col>
	// 						<input type="hidden" name="conversationId" id={this.state.inbox[i].id} value={this.state.inbox[i].id}/>
	// 					</form>
	// 				</Row>
	// 				</div>
	// 			</CollapsibleItem>
	// 		);
	// 		message = [];
	// 	}
	// 	this.setState({allMyMessages: messages});
	// }
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Crushs page'>All your crushs</Card>
						</Col>
						<Col s={4}>
							<Card></Card>
						</Col>
						<Col s={4}>
							<Card></Card>

						</Col>
						<Col s={4}>
							<Card></Card>
						</Col>
						<Col s={12}>

						<Table>
	<thead>
		<tr>
			<th data-field="id">Name</th>
			<th data-field="name">Sexe</th>
			<th data-field="price">Age</th>
			<th data-field="price">Localisation</th>
			<th data-field="price">Score</th>
			<th data-field="price">Actions</th>
		</tr>
	</thead>

	<tbody>
		<tr>
			<td>Alvin</td>
			<td>Eclair</td>
			<td>$0.87</td>
		</tr>
		<tr>
			<td>Alan</td>
			<td>Jellybean</td>
			<td>$3.76</td>
		</tr>
		<tr>
			<td>Jonathan</td>
			<td>Lollipop</td>
			<td>$7.00</td>
		</tr>
	</tbody>
</Table>
						</Col>

					</Row>
				</div>
			</Header>
		);
	}
}

export default Crushs;
