var express = require('express');
var app = express();

var swig = require('swig');
var mongo = require('mongodb');
var expressSession = require('express-session');
var crypto = require('crypto');
var gestorBD = require("./modules/gestorBD.js");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

/* BEGIN OF APP VARIABLES */

app.set('port', 8081);
app.set('db', 'mongodb://admin:abcdefg@ds119258.mlab.com:19258/redsocial');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);
app.set('jwt',jwt);

/* END OF APP VARIABLES */
gestorBD.init(app, mongo);

/* BEGIN OF APP PARAMETERS */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type ,
   // token
  next();
 });

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

// Router for API
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
  // obtener el token, puede ser un parámetro GET , POST o HEADER
  var token = req.body.token || req.query.token || req.headers['token'];
  if (token != null) {
    // verificar el token
    jwt.verify(token, 'secreto', function(err, infoToken) {
      if (err || (Date.now() / 1000 - infoToken.tiempo) > 240) {
        res.status(403); // Forbidden
        res.json({
          acceso: false,
          error: 'Token invalido o caducado'
        });
        // También podríamos comprobar que intoToken.usuario existe
        return;

      } else {
        // dejamos correr la petición
        res.usuario = infoToken.usuario;
        next();
      }
    });

  } else {
    res.status(403); // Forbidden
    res.json({
      acceso: false,
      mensaje: 'No hay Token'
    });
  }
});

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
require("./routes/rapiusuarios.js")(app, gestorBD);

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
