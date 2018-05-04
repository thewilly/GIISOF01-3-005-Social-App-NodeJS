module.exports = function(app, swig, gestorBD) {

  /*
   * AW_CU_01 GET Controller for the registration end-point.
   */
  app.get("/registrarse", function(req, res) {
    var respuesta = swig.renderFile('views/bregistro.html', {});
    res.send(respuesta);
  });

  /*
   * Controller for the register / login
   */
  app.post('/usuario', function(req, res) {
    if (req.body.password != req.body.password2) {
      res.redirect("/registrarse?mensaje=Las contraseñas no coinciden");
    } else {
      var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
              .update(req.body.password).digest('hex');

      var criterio = {
        email: req.body.email
      };

      gestorBD.obtenerUsuarios(criterio, function(usuarios) {
        if (usuarios != null || usuarios.length > 0) {
          res.redirect("/registrarse"
                  + "?mensaje=Email ya registrado en el sistema"
                  + "&tipoMensaje=alert-danger ");
        } else {
          var usuario = {
            email: req.body.email,
            name: req.body.nombre,
            password: seguro
          };

          gestorBD.insertarUsuario(usuario, function(id) {
            if (id == null) {
              res.redirect("/registrarse?mensaje=Error al registrar usuario");
            } else {
              res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
            }
          });
        }
      });
    }
  });

  app.get("/identificarse", function(req, res) {
    var respuesta = swig.renderFile('views/bidentificacion.html', {});
    res.send(respuesta);
  });

  app.post("/identificarse", function(req, res) {
    var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
    var criterio = {
      email: req.body.email,
      password: seguro
    }
    gestorBD.login(criterio, function(usuarios) {
      if (usuarios == null || usuarios.length == 0) {
        req.session.usuario = null;
        res.redirect("/identificarse" + "?mensaje=Email o password incorrecto"
                + "&tipoMensaje=alert-danger ");
      } else {
        req.session.usuario = usuarios[0].email;
        req.session.name = usuarios[0].name;
        console.log(req.session.name)
        res.redirect("/usuarios");
      }
    });
  });

  app.get("/usuarios", function(req, res) {
    var criterio = {};
    if (req.query.busqueda != null) {
      criterio = {
        '$or': [{
          "name": {
            $regex: ".*" + req.query.busqueda + ".*"
          }
        }, {
          "email": {
            $regex: ".*" + req.query.busqueda + ".*"
          }
        }]
      };
    }

    var pg = parseInt(req.query.pg); // Es String !!!
    if (req.query.pg == null) { // Puede no venir el param
      pg = 1;
    }

    var usuarios = gestorBD.obtenerUsuariosPg(criterio, pg, function(usuarios,
            total) {

      criterio = {
        send: req.session.usuario
      }
      var peticionesEnviadas = gestorBD.obtenerPeticiones(criterio, function(
              peticionesEnviadas) {
        
        console.log("ENVIADAS");
        console.log(peticionesEnviadas);

        criterio = {
          aEmail: req.session.usuario
        }

        var peticionesRecibidas = gestorBD.obtenerPeticiones(criterio,
                function(peticionesRecibidas) {
          
          console.log("RECIBIDAS");
          console.log(peticionesRecibidas);

                  var pgUltima = total / 5;
                  if (total % 5 > 0) { // Sobran decimales
                    pgUltima = pgUltima + 1;
                  }
                  var respuesta = swig.renderFile('views/bUsuarios.html', {
                    usuarios: usuarios,
                    peticionesEnviadas: peticionesEnviadas,
                    peticionesRecibidas: peticionesRecibidas,
                    actual: req.session.usuario,
                    boton: "true",
                    pgActual: pg,
                    pgUltima: pgUltima
                  });
                  res.send(respuesta);
                });
      });
    });
  });

  app.get('/invitaciones', function(req, res) {
    var pg = parseInt(req.query.pg); // Es String !!!
    if (req.query.pg == null) { // Puede no venir el param
      pg = 1;
    }
    var criterio = {
      aEmail: req.session.usuario
    }

    var invitacionesPg = gestorBD.obtenerInvitacionesPg(criterio, pg, function(
            invitacionesPg, total) {


      var pgUltima = total / 5;
      if (total % 5 > 0) { // Sobran decimales
        pgUltima = pgUltima + 1;
      }
      console.log('INVITACIONES');
      console.log(invitacionesPg);
      var respuesta = swig.renderFile('views/bPeticiones.html', {
        invitaciones: invitacionesPg,
        pgActual: pg,
        pgUltima: pgUltima
      });
      res.send(respuesta);
    });
  });

  app.get('/invitaciones/accept', function(req, res) {
    var peticion = {
            yoEmail: req.session.usuario,
            yoName: req.session.name,
            amigoEmail: req.query.name,
            amigoName: req.query.email
    };

    var peticionI = {
            amigoEmail: req.session.usuario,
            amigoName: req.session.name,
            yoEmail: req.query.aNombre,
            yoName: req.query.aEmail
    };
    console.log('INVITACION QUE ESTAMOS ACEPTANDO');
    console.log(peticion);
    
    gestorBD.aceptarPeticion(peticion, function(result) {
      if (result == 'finished') {
        gestorBD.aceptarPeticion(peticionI, function(resultI) {
        });
        res.redirect('/invitaciones');
      }
    });
  });

  app.get('/usuarios/peticion/create', function(req, res) {
    var peticion = {
      send: req.session.usuario,
      sendName:  req.session.name,
      aNombre: req.query.name,
      aEmail: req.query.email
    }

    gestorBD.insertarPeticion(peticion, function(respuesta) {
      if (respuesta == null) {
        res.send(respuesta);
      } else {
        res.redirect("/usuarios");
      }
    });
  });

  app.get('/amigos', function(req, res) {
    var pg = parseInt(req.query.pg); // Es String !!!
    if (req.query.pg == null) { // Puede no venir el param
      pg = 1;
    }
    var criterio = {
      usuarioA: req.session.usuario
    }

    var amigosPg = gestorBD.obtenerAmigosPg(criterio, pg, function(amigosPg,
            total) {


      var pgUltima = total / 5;
      if (total % 5 > 0) { // Sobran decimales
        pgUltima = pgUltima + 1;
      }

      var respuesta = swig.renderFile('views/bAmigos.html', {
        amigos: amigosPg,
        pgActual: pg,
        pgUltima: pgUltima
      });
      res.send(respuesta);
    });
  });

  app.get('/desconectarse', function(req, res) {
    req.session.usuario = null;
    req.session.usuario.name = null;
    res.send("Usuario desconectado");
  });

}
