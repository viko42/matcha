import React, { Component } from 'react';
import { Col, Card, Row, Collapsible, CollapsibleItem, Chip, Icon, Input, Button } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';
import moment	from 'moment';

import Header from '../../components/header/index'
import {logoName, apiUrl} from '../../config/crushyard'

class Inbox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			inbox: []
		};

		this.getMyInbox = this.getMyInbox.bind(this);
		this.focusBox = this.focusBox.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
		this.selectConversation = this.selectConversation.bind(this);
	}
	submitMessage(e) {
		e.preventDefault();

		if (!e.target.message || e.target.message.value.length < 1)
			return ;

		const send = {
			message: e.target.message.value,
			conversationId: e.target.conversationId.value
		}

		global.socket.emit('send message', send);
		e.target.message.value = "";
	}
	focusBox() {
		if (this.state.selectedBoxMessage <= this.state.inbox.length && this.state.selectedBoxMessage >= 0) {
			var objDiv = document.getElementById("box-message"+this.state.selectedBoxMessage);
			objDiv.scrollTop = objDiv.scrollHeight;
		}
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
		document.title = `${logoName} - Inbox`;
	}
	giveIndexConversation(id) {
		for (var i = 0; i < this.state.inbox.length; i++) {
			if (this.state.inbox[i].id === id)
				return i;
		}
		return -1;
	}
	componentDidMount() {
		const self = this;

		this.getMyInbox();
		global.socket.on('message sent', function (data) {
			let index = self.giveIndexConversation(data.conversationId);

			if (index !== -1)
				this.emit('give messages from conversation', {id: self.state.inbox[index].id, unread: false});
		})
		global.socket.on('give messages from conversation', function (data) {
			var inbox = self.state.inbox;

			for (var i = 0; i < inbox.length; i++) {
				if (inbox[i].id === data.conversationId) {
					inbox[i].messages	= data.messages;
					inbox[i].unread		= data.unread;
					break ;
				}
			}
			self.setState({inbox: inbox});

			self.getAllUser();
			if (self.state.selectedBoxMessage === self.giveIndexConversation(data.conversationId)) {
				self.focusBox(self.state.selectedBoxMessage);
			}
			else {
				console.log('Des messages sont en attente de lecture');
			}
		})
		global.socket.on('receive message', function (data) {
			let index = self.giveIndexConversation(data.conversationId);

			if (index !== -1)
				this.emit('give messages from conversation', {id: self.state.inbox[index].id, unread: self.state.selectedBoxMessage === self.giveIndexConversation(data.conversationId) ? false : true});
		})
	}
	componentWillUnmount() {
		global.socket.off('message sent');
		global.socket.off('give messages from conversation');
		global.socket.off('receive message');
	}
	selectConversation(which) {
		const self = this;

		if (!Number.isInteger(which) || which > self.state.inbox.length)
			return ;

		if (self.state.selectedBoxMessage === which)
			return self.state.selectedBoxMessage = -1;

		self.state.selectedBoxMessage = which;
		global.socket.emit('give messages from conversation', {id: self.state.inbox[self.state.selectedBoxMessage].id, unread: (self.state.selectedBoxMessage === self.giveIndexConversation(self.state.inbox[which].id)) ? false : true});
	}
 	getAllUser() {
		var messages = [], message = [];

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
					<div title={moment(this.state.inbox[i].messages[m].created_at).format('DD/MM/YYYY HH:MM')} key={m} className="chat-bubble">
						<p key={m} className={this.state.inbox[i].messages[m].sender === '1' ? 'messageChat me' : 'messageChat them'}>
							{this.state.inbox[i].messages[m].message}
						</p>
						{(!this.state.inbox[i].messages[m + 1] || (this.state.inbox[i].messages[m].sender !== this.state.inbox[i].messages[m + 1].sender)) && <div className={this.state.inbox[i].messages[m].sender === '1' ? 'message-date pull-right' : 'message-date'}>
							{moment(this.state.inbox[i].messages[m].created_at).format('DD/MM HH:MM')}
						</div>}
					</div>
				);
			}
			messages.push(
				<CollapsibleItem key={this.state.inbox[i].id}
					header={
						<div className={this.state.inbox[i].connected ? 'online' : 'offline'}>
							<Chip>
								<img src='img/yuna.jpg' alt='Contact Person' />
								{this.state.inbox[i].firstName} {this.state.inbox[i].lastName}
								{this.state.inbox[i].unread > 0 && <span className="notification-bubble-chat">{this.state.inbox[i].unread}</span>}
							</Chip>
							<a href={"#/profile/"+this.state.inbox[i].id_profile}>Visit profile</a>
							{/* <a onClick={this.deleteMessageInbox} className="pull-right deleteMessageInbox"><Icon>delete_forever</Icon></a> */}
						</div>}>
						<div id={'box-message' + i} className="myMessages">
							{message}
						</div>
					<div className="collapsible-send">
					<Row>
						<form onSubmit={this.submitMessage}>
							<Input type="text" name="message" label="Write here to answer" autoComplete="off" s={12} />
							<Col s={12}><Button>SEND</Button></Col>
							<input type="hidden" name="conversationId" id={this.state.inbox[i].id} value={this.state.inbox[i].id}/>
						</form>
					</Row>
					</div>
				</CollapsibleItem>
			);
			message = [];
		}
		this.setState({allMyMessages: messages});
	}
	render() {
		return (
			<Header>
				<div className="content">
					{this.state.allMyMessages && this.state.allMyMessages.length > 0 &&
						<Row>
							<Col m={12} s={12}>
								<Card title='Inbox page'>All your inbox messages</Card>
							</Col>
							<Col m={12} s={12}>
								<Collapsible accordion onSelect={this.selectConversation}>
									{this.state.allMyMessages}
								</Collapsible>
							</Col>
						</Row>
					}
					{(!this.state.allMyMessages || this.state.allMyMessages.length < 1) &&
						<Row>
							<Col m={12} s={12}>
								<Card title='Inbox page'>All your inbox messages</Card>
							</Col>
							<Col s={12} m={12} l={12} key='no-result'>
								<Card className='blue-grey darken-1' textClassName='white-text' title='Aucun resultat'>
									Vous n'avez aucun message pour l'instant !
								</Card>
							</Col>
						</Row>
					}
				</div>
			</Header>
		);
	}
}

export default Inbox;
