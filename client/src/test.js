import CheckToken from './auth'
import { Component } from 'react';


class getToken extends Component {
	async getTokenx() {
		const token = await localStorage.getItem('token');
		const obj = {
			'token': token,
			'id': '1'
		}
		const value = await CheckToken(obj);
		if (value === 10)
			return (true)
		return (false)
	}
}

export default getToken;
