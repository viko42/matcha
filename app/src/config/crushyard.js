exports.logoName	= "CrushYard";

if (process.env.NODE_ENV === "development") {
	exports.apiUrl		= "http://127.0.0.1:8080"
	exports.urlApp		= "http://localhost:5000"
} else {
	exports.apiUrl		= "http://79.137.36.192:46008"
	exports.urlApp		= "http://79.137.36.192:46009"
}
