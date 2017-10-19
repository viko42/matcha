import React, { Component } from 'react';
import { Col, Card, Row, Collection, CollectionItem, Chip, Input, Button, Icon, Carousel } from 'react-materialize';
import swal from 'sweetalert';
import services from '../../config/services';
import {urlApp} from '../../config/crushyard'
// import FileBase64 from 'react-file-base64';

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

		this.getLibrary = this.getLibrary.bind(this);
		this.toggleButton = this.toggleButton.bind(this);
		this.handleUpload = this.handleUpload.bind(this);

	}
	startConversation() {
		const self = this;

		services('startConversation', {getData: this.state.getData+'/start'}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			window.location.assign(urlApp + "/#/inbox");
		});
	}
	doCrush(value) {
		const self = this;
		console.log(value);
		services('doCrush', {getData: this.state.getData}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			if (response.data.doubleCrush) {
				swal({
					title: "You have a new crush !",
					text: "Speak directly with your new crush in the inbox section !",
					type: "success"
				}).then(() => {
					self.startConversation();
					global.socket.emit('send crush', {id: self.state.getData});
				});
			}
			else {
				swal("You send a crush", "This crush is sent. Hope he will crush with you too!", "success");
				global.socket.emit('send like', {id: self.state.getData});
			}
			self.getProfile();
		});
	}
	removeCrush(value) {
		const self = this;

		services('removeCrush', {getData: this.state.getData+'/remove'}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			swal("You deleted a crush", "Your conversation will be deleted!", "success");
			global.socket.emit('send unlike', {id: self.state.getData});
			self.getProfile();
		});
	}
	getLibrary(value) {
		var library = this.state.profile[value];
		var libraryRender = [];

		for (var i = 0; library && i < library.length; i++) {
			libraryRender.push(
				<Chip key={i}>#{library[i]}</Chip>
			);
		}
		return libraryRender;
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
		var values = {};

		if (String(button) === "about-me") {
			if (this.state.aboutMe === true) {
				values.aboutMe = document.getElementById(button).value;
				console.log(values);
				this.updateProfile(values);
			}
			this.setState({aboutMe: this.state.aboutMe ? false : true});
		}
		if (String(button) === "whyMe") {
			if (this.state.whyMe === true) {
				values.whyMe = document.getElementById(button).value;
				this.updateProfile(values);
			}
			this.setState({whyMe: this.state.whyMe ? false : true});
		}
		if (String(button) === "myInfos") {
			if (this.state.myInfos === true) {
				values.myInfosSexe = document.getElementById(button+"1").value;
				values.myInfosOrientation = document.getElementById(button+"2").value;
				console.log(values);
				this.updateProfile(values);
			}
			this.setState({myInfos: this.state.myInfos ? false : true});
		}
		if (String(button) === "myLibrary") {
			if (this.state.myLibrary === true) {
				values.myLibraryCat = "tags";
				values.myLibrary = document.getElementById(button).value;
				console.log(values);
				this.updateProfile(values);
			}
		}
		if (String(button) === "myLibraryClose") {
			this.setState({myLibrary: this.state.myLibrary ? false : true});
		}
	}
	updateProfile(values) {
		const self = this;

		services('updateProfile', values, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.getProfile();
		});
	}
	getProfile() {
		const self = this;

		services('getProfile', self.state, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				window.location.assign(urlApp + "/#");
				return ;
			}
			self.setState({profile: response.data.profile});
		});
	}
	componentDidMount() {
		this.getProfile();

		global.socket.emit('send visit', {id: this.state.getData});
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
										<a className="link-name tooltipped" data-position="bottom" data-delay="50" data-tooltip={profile.connected === false ? "User offline" : "User online"}><Icon className={profile.connected ? "online" : "offline"}>wb_sunny</Icon>{profile.firstName} {profile.lastName}</a><br/>
										{profile.connected === false && <a href>Last activity on {profile.last_activity}</a>}
										<div hidden={profile.me === true || profile.crushed === true ? true : false} className="yes-crush">
											<a onClick={this.doCrush.bind(this, true)} className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Want to crush ?"><Button floating large className='green' waves='light' icon='check' /></a>
										</div>
										<div hidden={profile.me === true || profile.crushed === true ? true : false} className="no-crush">
											<a onClick={this.removeCrush.bind(this, false)} className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Reject this profile"><Button floating large className='red' waves='light' icon='close' /></a>
										</div>

										<div hidden={profile.me === true || profile.crushed === false ? true : false} className="no-crush">
											<a onClick={this.removeCrush.bind(this, false)} className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Reject this profile"><Button floating large className='red' waves='light' icon='close' /></a>
										</div>
										<div hidden={profile.doubleCrush === true ? false : true} className="yes-crush">
											<a onClick={this.startConversation.bind(this)} className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Start a conversation!"><Button floating large className='blue' waves='light' icon='speaker_notes' /></a>
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

						{/* Content of my sidebar Profile */}
						<Col l={4} m={4} s={12}>

							<Card className="side-crush">
								<div className="side-crush-text">240 Crush(s)</div>
							</Card>

							<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a ">
								{!this.state.myInfos && profile.me && <a onClick={this.toggleButton.bind(this, 'myInfos')}>
									<Icon name="myInfos" className="hi-icon-small hi-icon-pencil f-black">edit</Icon>
								</a> }
								{this.state.myInfos && profile.me  && <a onClick={this.toggleButton.bind(this, 'myInfos')}>
									<Icon name="myInfos" className="hi-icon-small hi-icon-pencil f-black">done</Icon>
								</a> }
								{!this.state.myInfos &&
								<div>
									<div className="box-details-name">
										<Icon>wc</Icon>Sexe
									</div>
									<div className="box-details-content">
										{profile.sexe}
									</div>
								</div>
							}
								{this.state.myInfos && profile.me  &&
								<Row className="testViko">
									<Input s={12} type='select' id="myInfos1" label="Sexe" defaultValue='2'>
										<option value='Homme'>Homme</option>
										<option value='Femme'>Femme</option>
										<option value='N/B'>Non renseigné</option>
									</Input>
								</Row>
							 }


								<hr className="fullhr"/>
								{!this.state.myInfos &&
									<div>
										<div className="box-details-name">
											<Icon>power</Icon>Orientation
										</div>
										<div className="box-details-content">
											{profile.orientation}
										</div>
									</div>
								}
								{this.state.myInfos && profile.me  &&
									<Row className="testViko">
										<Input s={12} type='select' id="myInfos2" label="Orientation" defaultValue='2'>
											<option value='Hétero'>Hétéro</option>
											<option value='Lesbienne'>Lesbienne</option>
											<option value='Bisexuelle'>Bisexuelle</option>
										</Input>
									</Row>
							}
							</Card>

							<Collection>
								<CollectionItem id="testViko" hidden={profile.me === true ? false : true} className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a">
									{!this.state.myLibrary && <a className="pull-right" onClick={this.toggleButton.bind(this, 'myLibraryClose')}><Icon name="myLibrary" className="hi-icon-small hi-icon-pencil f-black">edit</Icon></a>}
									{this.state.myLibrary && <a className="pull-right" onClick={this.toggleButton.bind(this, 'myLibraryClose')}><Icon name="myLibrary" className="hi-icon-small hi-icon-pencil f-black">done</Icon></a>}
									<center>Add element</center>
									{this.state.myLibrary && <Row>
										{/* <Input s={12} type='select' id="myLibraryCat" label="" defaultValue='2'>
											<option value='Films'>Films</option>
											<option value='Sport'>Sport</option>
											<option value='Loisirs'>Loisirs</option>
											<option value='Livres'>Livres</option>
										</Input> */}
										<Input s={12} placeholder="Ecrivez-votre texte" id="myLibrary" type="text" />
										<a onClick={this.toggleButton.bind(this, 'myLibrary')}>
											<Button>Add</Button>
										</a>
									</Row>}
								</CollectionItem>

								{/* {profile.Films !== null && <CollectionItem><center>Films</center>
									{this.getLibrary('Films')}
								</CollectionItem>}

								{profile.Sport !== null && <CollectionItem><center>Sport</center>
									{this.getLibrary('Sport')}
								</CollectionItem>}

								{profile.Loisirs !== null && <CollectionItem><center>Loisirs</center>
									{this.getLibrary('Loisirs')}
								</CollectionItem>} */}

								{profile.tags !== null && <CollectionItem><center>Tags</center>
									{this.getLibrary('tags')}
								</CollectionItem>}
							</Collection>
						</Col>
						{/* Content of my profile */}
						<Col l={8} m={8} s={12}>
							<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a ">
								{!this.state.aboutMe	&& <div ><a hidden={profile.me === true ? false : true} onClick={this.toggleButton.bind(this, 'about-me')}>
									<Icon name="about-me" className="hi-icon hi-icon-pencil f-black">edit</Icon></a>
									<div className="about-me-title">About me</div>
									{!this.state.aboutMe	&& <div className="side-crush-text f-weight-200">{profile.aboutMe}</div>}
							</div>}
								{this.state.aboutMe		&& <div><a hidden={profile.me === true ? false : true} onClick={this.toggleButton.bind(this, 'about-me')}>
									<Icon className="hi-icon hi-icon-pencil f-black">done</Icon></a>
									<div className="about-me-title">About me</div>
									{this.state.aboutMe		&& <Row><div className="side-crush-text f-weight-200"><textarea placeholder="Ecrivez-votre texte" className="materialize-textarea" id="about-me" type="text" defaultValue={profile.aboutMe}></textarea></div></Row>}
								</div>}
							</Card>

							<Card className="hi-icon-wrap hi-icon-effect-9 hi-icon-effect-9a">
								{!this.state.whyMe	&& <div><a hidden={profile.me === true ? false : true} onClick={this.toggleButton.bind(this, 'whyMe')}>
									<Icon name="whyMe" className="hi-icon hi-icon-pencil f-black">edit</Icon></a>
									<div className="about-me-title">Why me ?</div>
									{!this.state.whyMe	&& <div className="side-crush-text f-weight-200">{profile.whyMe}</div>}
							</div>}
								{this.state.whyMe		&& <div><a hidden={profile.me === true ? false : true} onClick={this.toggleButton.bind(this, 'whyMe')}>
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
