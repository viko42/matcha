import React, { Component } from 'react';
import { Col, Card, Row, Collection, CollectionItem, Chip, Input, Button, Icon, Carousel } from 'react-materialize';
import swal from 'sweetalert';
import services from '../../config/services';
import $ from 'jquery';
import FileBase64 from 'react-file-base64';

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
		};

		this.getPublications = this.getPublications.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.toggleButton = this.toggleButton.bind(this);
		this.handleUpload = this.handleUpload.bind(this);

	}
	like() {

	}
	showPictures() {
		var pictures = [];
		for (var i = 0; i < this.state.profile.pictures.length; i++) {
			let name = this.state.profile.pictures[i].code + this.state.profile.pictures[i].data;
			pictures.push(name);
		}
		return pictures;
	}
	toggleButton(button, e) {
		e.preventDefault();
		var value;

		if (String(button) === "about-me") {
			if (this.state.aboutMe === true) {
				value = document.getElementById(button).value;
				console.log('Envoi au serveur');
				console.log(value);
			}
			this.setState({aboutMe: this.state.aboutMe ? false : true});
		}
		if (String(button) === "whyMe") {
			if (this.state.whyMe === true) {
				value = document.getElementById(button).value;
				console.log('Envoi au serveur');
				console.log(value);
			}
			this.setState({whyMe: this.state.whyMe ? false : true});
		}
		// console.log(e);
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
			console.log(response.data.profile);
		});
	}
	handleUpload(event) {
		const target = event.target, file = target.files[0];

		console.log(file);

		this.setState({file: event.target.files[0]});

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
										<div className="yes-crush">
											<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Want to crush ?"><Button floating large className='green' waves='light' icon='check' /></a>
										</div>
										<div className="no-crush">
											<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Reject this profile"><Button floating large className='red' waves='light' icon='close' /></a>
										</div>
										<div className="header-score">
											Popularity: 538 !
										</div>
									</div>
								]}>
								<div className="profile-header-avatar">
									<img alt="avatar" className="profile-avatar" src="img/avatar.jpg" />
								</div>

							</Card>
						</Col>

						{/* <Col l={12} m={12} s={12}>
							<Card>
								<Row>
									<form onSubmit={this.addMessage}>
										<Input s={12} label="Publiez un message" name="message" autoComplete="off" type="text" ></Input>
										<Button>Publier<Icon right>send</Icon></Button>
									</form>
								</Row>
							</Card>
						</Col> */}

						{/* Content of my sidebar Profile */}
						<Col l={4} m={4} s={12}>

							<Card className="side-crush">
								<div className="side-crush-text">240 Crush(s)</div>
							</Card>

							<Card>
								<div className="box-details-name">
									<Icon>wc</Icon>Sexe
								</div>
								<div className="box-details-content">
									Homme
								</div>
								<hr className="fullhr"/>
								<div className="box-details-name">
									<Icon>power</Icon>Orientation
								</div>
								<div className="box-details-content">
									Hetéro
								</div>
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
						</Col>
						{/* Content of my profile */}
						<Col l={8} m={8} s={12}>
							<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a ">
								{!this.state.aboutMe	&& <div><a onClick={this.toggleButton.bind(this, 'about-me')}>
									<Icon name="about-me" className="hi-icon hi-icon-pencil f-black">edit</Icon></a>
									<div className="about-me-title">About me</div>
									{!this.state.aboutMe	&& <div className="side-crush-text f-weight-200">{profile.aboutMe}</div>}
							</div>}
								{this.state.aboutMe		&& <div><a onClick={this.toggleButton.bind(this, 'about-me')}>
									<Icon className="hi-icon hi-icon-pencil f-black">done</Icon></a>
									<div className="about-me-title">About me</div>
									{this.state.aboutMe		&& <Row><div className="side-crush-text f-weight-200"><textarea placeholder="Ecrivez-votre texte" className="materialize-textarea" id="about-me" type="text" defaultValue={profile.aboutMe}></textarea></div></Row>}
								</div>}
							</Card>

							<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a">
								{!this.state.whyMe	&& <div><a onClick={this.toggleButton.bind(this, 'whyMe')}>
									<Icon name="whyMe" className="hi-icon hi-icon-pencil f-black">edit</Icon></a>
									<div className="about-me-title">Why me ?</div>
									{!this.state.whyMe	&& <div className="side-crush-text f-weight-200">{profile.whyMe}</div>}
							</div>}
								{this.state.whyMe		&& <div><a onClick={this.toggleButton.bind(this, 'whyMe')}>
									<Icon className="hi-icon hi-icon-pencil f-black">done</Icon></a>
									<div className="about-me-title">Why me ?</div>
									{this.state.whyMe		&& <Row><div className="side-crush-text f-weight-200"><textarea placeholder="Ecrivez-votre texte" className="materialize-textarea" id="whyMe" type="text" defaultValue={profile.whyMe}></textarea></div></Row>}
								</div>}
							</Card>

							{profile.pictures && profile.pictures.length &&
								<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a">
									<label htmlFor="file"><Icon id="addImage" name="whyMe" className="hi-icon hi-icon-pencil f-black">add_a_photo</Icon></label>

									<Carousel id="carousel" images={this.showPictures()} />
									  <input type="file" id="file" className="" accept="image/*" name="imageUpload" multiple onChange={this.handleUpload} />
									  <Button onClick={this.addByClick}></Button>
								</Card>
							}
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Profile;
