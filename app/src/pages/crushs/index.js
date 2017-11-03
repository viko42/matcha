import React, { Component } from 'react';
import { Col, Card, Row, Button } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'

import Header from '../../components/header/index'
import {logoName, apiUrl, urlApp} from '../../config/crushyard'

class Crushs extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			inbox: []
		};

		this.getCrush			= this.getCrush.bind(this);
		this.getList			= this.getList.bind(this);
		this.startConversation	= this.startConversation.bind(this);
	}
	startConversation(e) {
		e.preventDefault();

		const self	= this;
		const id	= e.target.profileId.value;

		services('startConversation', {getData: id+'/start'}, function (err, response) {
			console.log(self._isMount);
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			window.location.assign(urlApp + "/#/inbox");
		});
	}
	removeCrush(e) {
		e.preventDefault();

		const self	= this;
		const id	= e.target.profileId.value;

		services('removeCrush', {getData: id+'/remove'}, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			swal("You deleted a crush", "Your conversation will be deleted!", "success");
			global.socket.emit('send unlike', {id: id});
			self.getCrush();
		});
	}
	getList(crushs) {
		var render = [];

		if (!crushs || crushs.length < 1)
			render.push(
				<Col s={12} m={12} l={12} key='no-result'>
					<Card className='blue-grey darken-1' textClassName='white-text' title='Aucun resultat'>
						Vous n'avez aucun crush pour l'instant !
					</Card>
				</Col>
			);
		for (var i = 0; i < crushs.length; i++) {
			render.push(
				<Col s={12} m={6} l={6} className="xl3" key={i}>
					<Card className="crush-tag-card">
						<div className="crush-tag-buttons-close">
							<form onSubmit={this.removeCrush.bind(this)}>
								<input type="hidden" name="profileId" value={crushs[i].profileId}/>
								<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cancel this crush"><Button floating className='red actions-tag' waves='light' icon='close' /></a>
							</form>
						</div>
						<div className="crush-tag-name">{crushs[i].firstName}<br/>{crushs[i].age} ans</div>
						<div className="crushlist-tag-buttons">
							<form onSubmit={this.startConversation}>
								<input type="hidden" name="profileId" value={crushs[i].profileId}/>
								<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Speak with him"><Button floating className='blue actions-tag' waves='light' icon='message' /></a>
							</form>
						</div>
					</Card>
				</Col>
			);
		}
		if (this._isMount)
			this.setState({crushs: render});
	}
	getCrush() {
		const self = this;

		services('getCrush', self.state, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.getList(response.data.crushs);
		});
	}
	componentWillMount() {
		document.title = `${logoName} - Crushs`;
	}
	componentDidMount() {
		this.getCrush();
	}
	componentWillUnmount() {
		this._isMount = false;
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Trouvez votre crush qui vous ressemble !'>Liste de personne ayant crush avec vous !</Card>
						</Col>
						{this.state.crushs}
					</Row>
				</div>
			</Header>
		);
	}
}

export default Crushs;
