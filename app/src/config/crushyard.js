exports.logoName	= "CrushYard";

const ip = "localhost";

if (process.env.NODE_ENV === "development") {
	exports.apiUrl		= "http://127.0.0.1:8080";
	exports.urlApp		= "http://127.0.0.1:3000";
} else {
	exports.apiUrl		= "http://"+ip+":8080"
	exports.urlApp		= "http://"+ip+":5000"
}
