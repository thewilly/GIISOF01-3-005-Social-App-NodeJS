var express = require('express');
var app = express();

var swig = require('swig');
var mongo = require('mongodb');
var expressSession = require('express-session');
var crypto = require('crypto');
var gestorBD = require("./modules/gestorBD.js");
var bodyParser = require('body-parser');

/* BEGIN OF APP VARIABLES */

app.set('port', 8081);
app.set('db', 'mongodb://admin:abcdefg@ds119258.mlab.com:19258/redsocial');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

/* END OF APP VARIABLES */
gestorBD.init(app, mongo);

/* BEGIN OF APP PARAMETERS */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Loggin the error in the db.
app.use(function(err, req, res, next) {
  console.log("Error producido: " + err);
  if (!res.headersSent) {
    res.status(400);
    res.send("Recurso no disponible");
  }
});

// Setting the parameters for the express-session
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

/* END OF APP PARAMETERS */

/* BEGIN OF ROUTERS */

// Router for users session
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
  console.log("routerUsuarioSession");
  if (req.session.usuario) {
    // dejamos correr la petición
    next();
  } else {
    console.log("va a : " + req.session.destino);
    res.redirect("/identificarse");
  }
});

/* END OF ROUTERS */

require("./routes/rusuarios.js")(app, swig, gestorBD);

app.use(function(err, req, res, next) {
  console.log("Error producido: " + err + " req: " + req + " res: " + res);
  if (!res.headersSent) {
    res.status(400);
    res.send("Recurso no disponible");
  }
});

/* BEGIN OF SERVER CONFIGURATIONS */

// Making the server available at the given port.
app.listen(app.get('port'), function() {
  console.log("Servidor activo");
});

/* END OF SERVER CONFIGURATIONS */