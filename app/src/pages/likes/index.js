import React, { Component } from 'react';
import { Col, Card, Row, Button } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import {getLocalStorage} from '../../config/policies'

import Header from '../../components/header/index'
import {logoName, apiUrl} from '../../config/crushyard'

class Likes extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			inbox: [],
			users: [],
		};
	}
	componentWillMount() {
		document.title = `${logoName} - Mes likes`;

		services('verifyToken', {token: getLocalStorage('auth')}, function (err, response) {
			if (err)
				return window.location.reload();
		});
	}
	getUsers(users) {
		var render = [];

		if (!users || users.length < 1)
			render.push(
				<Col s={12} m={12} l={12} key='no-result'>
					<Card className='blue-grey darken-1' textClassName='white-text' title='Aucun resultat'>
						Vous n'avez aucun like pour l'instant !
					</Card>
				</Col>
			);

		for (var i = 0; i < users.length; i++) {
			render.push(
				<Col key={i} s={12} m={6} l={6} className="xl3">
					<Card className="crush-tag-card">
						<div className="crush-tag-name">{users[i].firstName} {users[i].lastName}<br/>{users[i].age} ans</div>
						<div className="crushlist-tag-buttons">
							<a href={'/#/profile/'+users[i].profileId } className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
						</div>
					</Card>
				</Col>
			);
		}
		this.setState({users: render});
	}
	componentDidMount() {
		const self = this;

		services('getLikes', {}, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.getUsers(response.data.likes);
		});
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
							<Card title='Mes likes'>Liste des personnes qui ont liké votre profile !</Card>
						</Col>
						{this.state.users}
					</Row>
				</div>
			</Header>
		);
	}
}

export default Likes;
