exports.getLocalStorage = function (value) {
	try {
		return JSON.parse(localStorage.getItem(value));
	} catch ($e) {
		try {
			return localStorage.getItem(value);
		} catch ($e) {
			return global[value];
		}
	}
}
exports.remLocalStorage = function (value) {
	try {
		return localStorage.removeItem(value);
	} catch ($e) {
		return delete global[value];
	}
}
exports.setLocalStorage = function (value, data) {
	try {
		return localStorage.setItem([value], JSON.stringify(data));
	} catch ($e) {
		return (global[value] = data);
	}
}
