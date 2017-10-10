import React, { Component } from 'react';
import { Col, Card, Row, Collapsible, CollapsibleItem, Chip, Icon, Input, Button } from 'react-materialize';
import services from '../../config/services';
// import _ from 'underscore';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';
// import moment	from 'moment';
import $		from 'jquery';

import Header from '../../components/header/index'

// console.log(socket.connect;
class Inbox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: "http://127.0.0.1:8080",
			inbox: []
		};
		// console.log('Connected ?');
		// console.log(socket);
		this.getMyInbox = this.getMyInbox.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
	}
	submitMessage(e) {
		e.preventDefault();

		if (!e.target.message || e.target.message.value.length < 1)
			return ;

		const send = {
			message: e.target.message.value,
			conversationId: e.target.conversationId.value
		}

		// services('sendMessage', {message: send.message, id: send.conversationId}, function (err, response) {
		// 	if (err) {
		// 		this.setState({errors: response.data.errors})
		// 		if (response.data.errors.swal)
		// 			swal("Error", response.data.errors.swal, "error");
		// 		return ;
		// 	}
		// 	console.log(response.data);
		// });
		global.socket.emit('send message', send);

		e.target.message.value = "";
		// self.setState({inbox: actualInbox});
		$('#footer')[0].scrollIntoView(true);

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
			// console.log(response.data);
			self.setState({inbox: response.data.inbox})
			self.getAllUser();
		});
	}

	componentDidMount() {
		document.title = "Inbox";
		// const self = this;

		// console.log(this.state.response);
		this.getMyInbox();
		global.socket.on('message sent', function (data) {
			console.log('Message sent--  message from server');
			console.log(data);
		})
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
	getAllUser() {
		// const self = this;
		var messages = [];
		var message = [];

		// console.log('Get All messages : ', this.state.inbox.length);
		for (var i = 0; i < this.state.inbox.length; i++) {
			if (this.state.inbox[i].messages.length < 1) {
				message.push(
					<div key={i} className="chat-bubble">
						<p className='messageChat system'>
							Start your chat now !
						</p>
					</div>
				);
			}
			for (var m = 0; m < this.state.inbox[i].messages.length; m++) {
				message.push(
					<div title={this.state.inbox[i].messages[m].date} key={m} className="chat-bubble">
						<p key={m} className={this.state.inbox[i].messages[m].sender === '1' ? 'messageChat me' : 'messageChat them'}>
							{this.state.inbox[i].messages[m].content}
						</p>
						{(!this.state.inbox[i].messages[m + 1] || (this.state.inbox[i].messages[m].sender !== this.state.inbox[i].messages[m + 1].sender)) && <div className={this.state.inbox[i].messages[m].sender === '1' ? 'message-date pull-right' : 'message-date'}>
							{this.state.inbox[i].messages[m].date}
						</div> }
					</div>
				);
			}
			messages.push(
				<CollapsibleItem key={this.state.inbox[i].id}
					header={
						<div>
							<Chip>
								<img src='img/yuna.jpg' alt='Contact Person' />
								{this.state.inbox[i].firstName} {this.state.inbox[i].lastName}
							</Chip>
							<a onClick={this.deleteMessageInbox} className="pull-right deleteMessageInbox"><Icon>delete_forever</Icon></a>
						</div>}>
					{message}
					<Row>
						<form onSubmit={this.submitMessage}>
							<Input type="text" name="message" label="Write here to answer" autoComplete="off" s={12} />
							<input type="hidden" name="conversationId" value={this.state.inbox[i].id}/>
							<Col s={12}><Button ref={m}>SEND</Button></Col>
						</form>
					</Row>
				</CollapsibleItem>
			);
			message = [];
		}
		// self.setState({messages: messages})
		return (
			messages
		);
	}
	render() {
		const { response } = this.state;
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Inbox page'>All your inbox messages {response}</Card>
						</Col>
						<Col m={12} s={12}>
							<Collapsible accordion>
								{this.getAllUser()}
							</Collapsible>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Inbox;
