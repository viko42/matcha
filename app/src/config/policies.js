exports.getLocalStorage = function (value) {
	return JSON.parse(localStorage.getItem(value));
}
exports.remLocalStorage = function (value) {
	return localStorage.getItem(value);
}
exports.setLocalStorage = function (value, data) {
	return localStorage.setItem([value], JSON.stringify(data));
}
