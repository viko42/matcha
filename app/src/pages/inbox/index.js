import React, { Component } from 'react';
import { Col, Card, Row, Collapsible, CollapsibleItem, Chip, Icon, Input, Button } from 'react-materialize';
import services from '../../config/services';
import _ from 'underscore';
import socketIOClient from "socket.io-client";

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';
import moment	from 'moment';
import $		from 'jquery';

import Header from '../../components/header/index'
import SideBar from '../../components/sidebar/index'
import Footer from '../../components/footer/index'

class Inbox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: "http://127.0.0.1:8080",
			messageLog: [],
			inbox: [
				{
					'name': 'Jane Doe',
					'id': 'test',
					'premium': false,
					'last_activity': '0000-00-00',
					'messages': [
						{
							'sender': "0",
							'content': "Bonjour",
							'date': '02/04/2017 12:00'
						},
						{
							'sender': "1",
							'content': "Salut !",
							'date': '02/04/2017 12:02'
						},
						{
							'sender': "0",
							'content': "Tu vas bien ?",
							'date': '02/04/2017 12:03'
						},
						{
							'sender': "1",
							'content': "Super merci !",
							'date': '02/04/2017 12:04'
						},
						{
							'sender': "0",
							'content': "TOP",
							'date': '02/04/2017 12:05'
						}
					]
				},
				{
					'name': 'Jean Caisse',
					'id': 'test2',
					'premium': false,
					'last_activity': '0000-00-00',
					'messages': [
						{
							'sender': "0",
							'content': "Coucou",
							'date': '02/04/2017 12:01'
						},
						{
							'sender': "1",
							'content': "Tu vas bien !",
							'date': '02/04/2017 12:01'
						},
						{
							'sender': "0",
							'content': "Non pas top",
							'date': '02/04/2017 12:02'
						},
						{
							'sender': "1",
							'content': "abon??",
							'date': '02/04/2017 12:03'
						},
						{
							'sender': "1",
							'content': "tla??",
							'date': '02/04/2017 12:04'
						}
					]
				}
			]
		};
		this.submitMessage = this.submitMessage.bind(this);
		this.getMyInbox = this.getMyInbox.bind(this);
	}
	submitMessage(e) {
		e.preventDefault();

		if (!e.target.message || e.target.message.value.length < 1)
			return ;

		const self = this;
		const actualInbox = self.state.inbox;

		for (var i = 0; i < actualInbox.length; i++) {
			if (actualInbox[i].id === e.target.to.value) {
				actualInbox[i].messages.push({
					'sender': "1",
					'content': e.target.message.value,
					'date': moment().format('DD/MM h:mm a')
				});
			}
		}
		e.target.message.value = "";
		self.setState({inbox: actualInbox});
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
			// swal("Summary", "Successfully registered !", "success");
			// self.props.history.push('/');
		});
	}
	getAllUser() {
		var messages = [];
		var message = [];

		for (var i = 0; i < this.state.inbox.length; i++) {
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
								{this.state.inbox[i].name}
							</Chip>
							<a onClick={this.deleteMessageInbox} className="pull-right deleteMessageInbox"><Icon>delete_forever</Icon></a>
						</div>}>
					{message}
					<Row>
						<form onSubmit={this.submitMessage}>
							<Input type="text" name="message" label="Write here to answer" s={12} />
							<input type="hidden" name="to" value={this.state.inbox[i].id}/>
							<Col s={12}><Button ref={m}>SEND</Button></Col>
						</form>
					</Row>
				</CollapsibleItem>
			);
			message = [];
		}
		return (
			messages
		);
	}
	componentDidMount() {
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint);
		const self = this;

		socket.on("FromAPI", function (data) {
			console.log(data);
			self.setState({ response: data.tmp });
		});
		// console.log(this.state.response);
		document.title = "Inbox";
		this.getMyInbox();
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
		const { response } = this.state;
		return (
			<div>
				<Header />
				<SideBar />
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
				<Footer />
			</div>
		);
	}
}

export default Inbox;
