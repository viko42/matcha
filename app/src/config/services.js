import axios from 'axios';

const apiUrl = "http://localhost:8080/";
const tabs = {
	'createUser': {
		'method': 'POST',
		'url': apiUrl + 'users/create'
	}
}

const Services = (props, data, callback) => {
	console.log('Services');
	console.log(data);
	axios({
		method: tabs[props].method,
		url: tabs[props].url,
		data: data
	}).then(function (res) {
		return callback(null, res);
	}).catch(function (err) {
		if (err.response)
			return callback(err.response.data.errors, err.response);
	});
}

export default Services;
