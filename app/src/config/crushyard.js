exports.logoName	= "CrushYard";

if (process.env.NODE_ENV === "development") {
	// exports.apiUrl		= "http://e1r12p13.42.fr:8080"
	exports.apiUrl		= "http://localhost:8080"
	exports.urlApp		= "http://localhost:5000"
	// exports.urlApp		= "http://e1r12p13.42.fr:5000"
} else {
	exports.apiUrl		= "https://79.137.36.192:"+process.env.PORTAPI
	exports.urlApp		= "https://79.137.36.192"+process.env.PORTAPP
}
