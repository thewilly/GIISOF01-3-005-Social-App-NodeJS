var express = require('express');
var app = express();

var swig = require('swig');
var mongo = require('mongodb');

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@ds119258.mlab.com:19258/redsocial');
app.set('clave', 'abcdefg');

// Loggin the error in the db.
app.use(function(err, req, res, next) {
	console.log("Error producido: " + err);
	if (!res.headersSent) {
		res.status(400);
		res.send("Recurso no disponible");
	}
});

// Making the server available at the given port.
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});