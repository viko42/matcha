import React, { Component } from 'react';
import { Table, Col, Card, Row } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';

import swal		from 'sweetalert';

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import {getLocalStorage} from '../../config/policies'

import Header from '../../components/header/index'
import {logoName, apiUrl} from '../../config/crushyard'

class Visits extends Component {
	_isMount = true;
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			inbox: [],
			visitors: [],
		};
	}

	getUsers(users) {
		var render = [];

		if (!users || users.length < 1)
			render.push(
				<tr key='no-result'>
					<td>Aucune visite trouvée</td>
				</tr>
			);

		for (var i = 0; users && i < users.length; i++) {
			render.push(
				<tr key={i}>
					<td>{users[i].firstName} {users[i].lastName}</td>
					<td>{users[i].date}</td>
					<td><a href={"#/profile/"+ users[i].profileId }>Voir profile</a></td>
				</tr>
			);
		}
		this.setState({visitors: render});
	}
	componentWillMount() {
		document.title = `${logoName} - Mes visites`;

		services('verifyToken', {token: getLocalStorage('auth')}, function (err, response) {
			if (err)
				return window.location.reload();
		});
	}
	componentDidMount() {
		const self = this;

		services('getVisits', {}, function (err, response) {
			if (self._isMount === false)
				return ;
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			self.getUsers(response.data.visitors);
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
							<Card title='Mes visites'>Liste des personnes qui ont vus votre profile !</Card>
						</Col>
						<Col m={12} s={12}>

						<Table>
							<thead>
								<tr>
									<th data-field="id">Qui ?</th>
									<th data-field="name">Quand ?</th>
									<th data-field="name">Actions</th>
								</tr>
							</thead>

							<tbody>
								{this.state.visitors}
							</tbody>
						</Table>
					</Col>

					</Row>
				</div>
			</Header>
		);
	}
}

export default Visits;
