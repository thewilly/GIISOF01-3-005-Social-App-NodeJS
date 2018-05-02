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
      console.log('The masswords missmatch so aborting the user creation.');
      res.redirect("/registrarse?mensaje=Las contraseñas no coinciden");
    } else {
      console.log('The passwords match so more filters to pass.');
      var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
              .update(req.body.password).digest('hex');

      var criterio = {
        email: req.body.email
      };

      gestorBD.obtenerUsuarios(criterio, function(usuarios) {
        if (usuarios != null || usuarios.length > 0) {
          console.log('Email already registered, aborting the user creation.')
          res.redirect("/registrarse"
                  + "?mensaje=Email ya registrado en el sistema"
                  + "&tipoMensaje=alert-danger ");
        } else {
          console.log('The email has not been registered so creating user.');
          var usuario = {
            email: req.body.email,
            name: req.body.nombre,
            password: seguro
          };
          console.log("User to create -> " + usuario.name + " " + usuario.email
                  + " " + usuario.password);

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
    gestorBD.login(criterio,function(usuarios) {
      if (usuarios == null || usuarios.length == 0) {
        req.session.usuario = null;
        res.redirect("/identificarse" + "?mensaje=Email o password incorrecto"
                + "&tipoMensaje=alert-danger ");
      } else {
        req.session.usuario = usuarios[0].email;
        res.redirect("/listarUsuarios");
      }
    });
  });

  app.get("/listarUsuarios", function(req, res) {
    var criterio = {};
    if (req.query.busqueda != null) {
      criterio = {
        '$or': [{
          "nombre": {
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


    var usuarios = gestorBD.obtenerUsuarios(pg, function(usuarios, total) {

      var criterio = {
        usuario: req.session.usuario
      }
      var peticiones = gestorBD.obtenerPeticiones(criterio,
              function(peticiones) {

                var pgUltima = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                  pgUltima = pgUltima + 1;
                }

                var respuesta = swig.renderFile('views/blistaUsuarios.html', {
                  usuarios: usuarios,
                  peticiones: peticiones,
                  boton: "true",
                  pgActual: pg,
                  pgUltima: pgUltima
                });
                res.send(respuesta);
              });
    });
  });

  app.get('/listarUsuarios/peticion/:email', function(req, res) {
    var peticion = {
      usuario: req.session.usuario,
      peticionId: req.params.email
    }
    gestorBD.insertarPeticion(peticion, function(idPeticion) {
      if (idPeticion == null) {
        res.send(respuesta);
      } else {
        res.redirect("/listarUsuarios");
      }
    });
  });

  app.get('/desconectarse', function(req, res) {
    req.session.usuario = null;
    res.send("Usuario desconectado");
  });

}
