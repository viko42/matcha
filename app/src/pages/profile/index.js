import React, { Component } from 'react';
import { Col, Card, Row, CardTitle, Collection, CollectionItem, Chip, Input, Button, Icon } from 'react-materialize';
import swal from 'sweetalert';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import Header from '../../components/header'
import {logoName} from '../../config/crushyard'

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			getData: props.match.params.id,
			profile: {},
			messagesRender: [],
			messages: [
			{
				content: 'Premier message',
				created_at: '0000-00-00'
			},
			{
				content: 'Deuz message',
				created_at: '0000-00-00'
			},
			{
				content: 'Trois message',
				created_at: '0000-00-00'
			}
		]
		};

		this.getPublications = this.getPublications.bind(this);
		this.addMessage = this.addMessage.bind(this);
	}

	getPublications() {
		var messages = this.state.messages;
		var renduMessage = [];

		for (var i = 0; i < messages.length; i++) {
			renduMessage.push(
				<Card key={i}>
					{messages[i].content}
				</Card>
			);
		}
		console.log('Get Publications');
		this.setState({messagesRender: renduMessage});
	}
	addMessage(e) {
		e.preventDefault();

		var messages = this.state.messagesRender;
		var message = e.target.message && e.target.message.value;

		console.log('message : ');
		console.log(message);
		if (!message)
			return ;

		messages.push(
			// <Card key={messages.length+1}>
			<Card key={messages.length+1}>
				{message}
			</Card>
		);
		e.target.message.value = "";
		this.setState({messagesRender: messages})
	}
	componentDidMount() {
		const self = this;

		services('getProfile', self.state, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.setState({profile: response.data.profile});
			self.getPublications();
		});
	}
	componentWillMount() {
		document.title = `${logoName} - Profile`;
	}
	render() {
		const { profile } = this.state;
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card
								className="card-header"
								actions={[
									<div key='header' className="links-header">
										<a className="link-name">{profile.firstName} {profile.lastName}</a>
										<div className="header-score">
											Popularity: 538 !
										</div>
									</div>
								]}>
								<div className="profile-header-avatar">
									<img className="profile-avatar" src="img/avatar.jpg" />
								</div>

							</Card>
						</Col>

						{/* Content of my sidebar Profile */}
						<Col l={3} m={4} s={12}>
							<Card className="side-crush">
								<div className="side-crush-text">240 Crush(s)</div>
							</Card>
							<Collection>

								<CollectionItem><center>Films</center>
									<Chip>La grande vadrouille</Chip>
									<Chip>Forrest Gump</Chip>
								</CollectionItem>

								<CollectionItem><center>Sport</center>
									<Chip>Judo</Chip>
									<Chip>Bicross</Chip>
								</CollectionItem>

								<CollectionItem><center>Loisirs</center>
									<Chip>Soiree</Chip>
									<Chip>Fete</Chip>
								</CollectionItem>

								<CollectionItem><center>Livres</center>
									<Chip>Les plus belles histoirs</Chip>
									<Chip>Cyrano de Bergerac</Chip>
								</CollectionItem>
							</Collection>
							<Card title="SideBar">
								This is my sideBar
							</Card>
							<Card title="SideBar">
								This is my sideBar
							</Card>
						</Col>

						{/* Content of my profile */}
						<Col l={9} m={6} s={12}>
							<Card>
								<Row>
									<form onSubmit={this.addMessage}>
										<Input s={12} label="Publiez un message" name="message" autoComplete="off" type="text" ></Input>
										<Button>Publier<Icon right>send</Icon></Button>
									</form>
								</Row>
							</Card>
						</Col>
						<Col l={9} m={6} s={12}>
							{this.state.messagesRender}
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Profile;
