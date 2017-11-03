import React, { Component } from 'react';
import { Col, Card, Row, Collapsible, CollapsibleItem } from 'react-materialize';

import '../../index.css';
import './index.css';

import Header from '../../components/header/index'
import {logoName} from '../../config/crushyard'

class Support extends Component {
	_isMount = true;
	componentWillUnmount() {
		this._isMount = false;
	}
	componentDidMount() {
		document.title =  `${logoName} - Support`;
	}
	render() {
		return (
			<Header>
				<div className="content">
					<Row>
						<Col m={12} s={12}>
							<Card title='Contactez le support'></Card>
						</Col>
						<Col m={12} s={12}>
							 {/* defaultActiveKey={1} */}
								<Collapsible popout>
									<CollapsibleItem header='Notre hotline' icon='local_phone'>
										+00322233 (Numero surtaxé à la race)
									</CollapsibleItem>
									<CollapsibleItem header='Nos agents' icon='work'>
										<img src="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/b/bc/817260_wtf-funny-face-so-funny_200s.gif/revision/latest?cb=20160606225753" alt="lol" height="300px"/>
										<img src="https://i.pinimg.com/736x/7c/d5/a5/7cd5a506d54fb8397c50b3b262f0b850--funny-face-swap-face-swaps.jpg" alt="lol" className="nos-agents"/>

									</CollapsibleItem>
									<CollapsibleItem header='Notre devise' icon='wb_incandescent'>
										C'est en se plantant qu'on peut pousser
									</CollapsibleItem>
								</Collapsible>
						</Col>
					</Row>
				</div>
			</Header>
		);
	}
}

export default Support;
