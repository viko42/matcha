import React, { Component } from 'react';
import { Col, Card, Row, Button, Tabs, Tab, Chip } from 'react-materialize';
import services from '../../config/services';

import '../../index.css';
import './index.css';
// import $ from 'jquery';

import swal		from 'sweetalert';

// import ReactTable from 'react-table'
// import 'react-table/react-table.css'

import Header from '../../components/header/index'
import {logoName, apiUrl} from '../../config/crushyard'

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			response: false,
	        endpoint: apiUrl,
			loca: false,
			age: false,
			sexe: false,
			orien: false,
			listFilter: {},
			filterRender: [],
			users: []
		};

		this.delFilter = this.delFilter.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.addFilter = this.addFilter.bind(this);
	}
	updateFilter(id, e) {
		var filterText = e.target.text;

		this.setState({
			sexe: filterText === 'Sexe' && this.state.sexe === false ? true : false,
			orien: filterText === 'Orientation sexuel' && this.state.orien === false ? true : false,
			age: filterText === 'Age' && this.state.age === false ? true : false,
			loca: filterText === 'Localisation' && this.state.loca === false ? true : false,
		});
		// if (filterText === "Sexe") {
		// 	this.setState({sexe: this.state.sexe === false ? true : false});
		// }
		// console.log(this.state);
	}
	// exist(value) {
	// 	for (var i = 0; i < this.state.listFilter.length; i++) {
	// 		if (this.state.listFilter[i] === value)
	// 			return true;
	// 	}
	// 	return false;
	// }
	addFilter(id, e) {
		var filterText = e.target.text;
		var listFilter = this.state.listFilter;

		if (filterText === "Homme" || filterText === "Femme")
			listFilter.sexe = filterText

		if (filterText === "Hétéro" || filterText === "Lesbienne" || filterText === "Bisexuelle")
			listFilter.orien = filterText

		if (filterText === "18 à 25" || filterText === "25 à 35" || filterText === "35 et plus")
			listFilter.age = filterText

		if (filterText === "Moins de 1km" || filterText === "Moins de 5km" || filterText === "Moins de 10km" || filterText === "Moins de 25km" || filterText === "Moins de 100km")
			listFilter.loca = filterText

		this.setState({listFilter: listFilter});
		this.getFilter();
	}
	submitMessage(e) {
		e.preventDefault();
	}
	componentWillMount() {
		document.title = `${logoName} - Find Your Crush`;
	}
	getUsers(users) {
		var render = [];

		console.log('GetUsers');
		for (var i = 0; i < users.length; i++) {
			render.push(
				<Col key={i} s={12} m={6} l={6} className="xl3">
					<Card className="crush-tag-card">
						<div className="crush-tag-name">{users[i].firstName} {users[i].lastName}<br/>22 ans</div>
						<img alt="profile" className="crush-tag-img" src="img/yuna.jpg"/>
						<div className="crush-tag-buttons">
							<a href={'/#/profile/'+users[i].id } className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Visit this profile"><Button floating className='grey actions-tag' waves='light' icon='input' /></a>
						</div>
					</Card>
				</Col>
			);
		}
		this.setState({users: render});
	}
	componentDidMount() {
		const self = this;

		services('find', {filters: this.state.listFilter}, function (err, response) {
			if (err) {
				self.setState({errors: response.data.errors})
				if (response.data.errors.swal)
					swal("Error", response.data.errors.swal, "error");
				return ;
			}
			console.log('get ??');
			self.getUsers(response.data.users);
			// window.location.assign(urlApp + "/#/inbox");
		});
	}
	componentWillUnmount() {
		// global.socket.off('message sent');
	}

	getFilter() {
		var render = [];

		if (this.state.listFilter.sexe)
			render.push(<a key={1} name="sexe"><Chip>{this.state.listFilter.sexe}</Chip></a>);
		if (this.state.listFilter.loca)
			render.push(<a key={2} name="loca"><Chip>{this.state.listFilter.loca}</Chip></a>);
		if (this.state.listFilter.orien)
			render.push(<a key={3} name="orien"><Chip>{this.state.listFilter.orien}</Chip></a>);
		if (this.state.listFilter.age)
			render.push(<a key={4} name="age"><Chip>{this.state.listFilter.age}</Chip></a>);

		this.setState({filterRender: render})
	}
	delFilter(e) {
		e.preventDefault();

		this.setState({listFilter: {}}, () => {
			this.getFilter();
		});
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Trouvez votre crush qui vous ressemble !'>Liste de personne ayant le plus de tag en commun avec vous ! <a href>(Voir plus)</a></Card>
						</Col>
						<Col m={12} s={12} onClick={this.delFilter}>

							{this.state.filterRender.length > 0 && <a className="reset-filter">Reset des filtres</a>}
						</Col>
						<Tabs name="tabFilter" onChange={this.updateFilter} className='tab-demo z-depth-1'>
							<Tab title="Sexe"></Tab>
							<Tab title="Orientation sexuel">Test 2</Tab>
							<Tab title="Age">Test 3</Tab>
							<Tab title="Localisation">Test 4</Tab>
						</Tabs>
						{this.state.sexe === true && <Tabs onChange={this.addFilter} className='tab-demo z-depth-1'>
							<Tab title="Homme"></Tab>
							<Tab title="Femme"></Tab>
						</Tabs>
						}
						{this.state.orien === true && <Tabs onChange={this.addFilter} className='tab-demo z-depth-1'>
							<Tab title="Hétéro">
							</Tab>
							<Tab title="Lesbienne">
							</Tab>
							<Tab title="Bisexuelle">
							</Tab>
						</Tabs>
						}
						{this.state.age === true && <Tabs onChange={this.addFilter} className='tab-demo z-depth-1'>
							<Tab title="18 à 25">
							</Tab>
							<Tab title="25 à 35">
							</Tab>
							<Tab title="35 et plus">
							</Tab>
						</Tabs>
						}
						{this.state.loca === true && <Tabs onChange={this.addFilter} className='tab-demo z-depth-1'>
							<Tab title="Moins de 1km">
							</Tab>
							<Tab title="Moins de 5km">
							</Tab>
							<Tab title="Moins de 10km">
							</Tab>
							<Tab title="Moins de 25km">
							</Tab>
							<Tab title="Moins de 100km">
							</Tab>
						</Tabs>
						}
						<Col s={12}>
							{this.state.filterRender}
						</Col>
						{this.state.users}
						{/* <Col s={12} m={6} l={6} className="xl3">
							<Card className="crush-tag-card">
								<div className="crush-tag-buttons-close">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cancel this crush"><Button floating className='red actions-tag' waves='light' icon='close' /></a>
								</div>
								<div className="crush-tag-name">Victor Lancien<br/>22 ans</div>
								<img alt="profile" className="crush-tag-img" src="img/yuna.jpg"/>
								<div className="crush-tag-buttons">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Speak with him"><Button floating className='blue actions-tag' waves='light' icon='message' /></a>
								</div>
							</Card>
						</Col>
						<Col s={12} m={6} l={6} className="xl3">
							<Card className="crush-tag-card">
								<div className="crush-tag-buttons-close">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cancel this crush"><Button floating className='red actions-tag' waves='light' icon='close' /></a>
								</div>
								<div className="crush-tag-name">Victor Lancien<br/>22 ans</div>
								<img alt="profile" className="crush-tag-img" src="img/yuna.jpg"/>
								<div className="crush-tag-buttons">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Speak with him"><Button floating className='blue actions-tag' waves='light' icon='message' /></a>
								</div>
							</Card>
						</Col>
						<Col s={12} m={6} l={6} className="xl3">
							<Card className="crush-tag-card">
								<div className="crush-tag-buttons-close">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cancel this crush"><Button floating className='red actions-tag' waves='light' icon='close' /></a>
								</div>
								<div className="crush-tag-name">Victor Lancien<br/>22 ans</div>
								<img alt="profile" className="crush-tag-img" src="img/yuna.jpg"/>
								<div className="crush-tag-buttons">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Speak with him"><Button floating className='blue actions-tag' waves='light' icon='message' /></a>
								</div>
							</Card>
						</Col>
						<Col s={12} m={6} l={6} className="xl3">
							<Card className="crush-tag-card">
								<div className="crush-tag-buttons-close">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cancel this crush"><Button floating className='red actions-tag' waves='light' icon='close' /></a>
								</div>
								<div className="crush-tag-name">Victor Lancien<br/>22 ans</div>
								<img alt="profile" className="crush-tag-img" src="img/yuna.jpg"/>
								<div className="crush-tag-buttons">
									<a className="tooltipped" data-position="bottom" data-delay="50" data-tooltip="Speak with him"><Button floating className='blue actions-tag' waves='light' icon='message' /></a>
								</div>
							</Card>
						</Col> */}
					</Row>
				</div>
			</Header>
		);
	}
}

export default Search;
