exports.logoName	= "CrushYard";

const ip = "localhost";

if (process.env.NODE_ENV === "development") {
	exports.apiUrl		= "http://localhost:8080";
	exports.urlApp		= "http://localhost:3000";
} else {
	exports.apiUrl		= "http://"+ip+":8080"
	exports.urlApp		= "http://"+ip+":5000"
}
