module.exports = function(app, gestorBD) {

  /**
   * S.1 IDENTIFICARSE COMO USAURIO
   */
  app.post("/api/autenticar/", function(req, res) {
    var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
    var criterio = {
      email: req.body.email,
      password: seguro
    }

    gestorBD.obtenerUsuarios(criterio, function(usuarios) {
      if (usuarios == null || usuarios.length == 0) {
        res.status(401); // Unauthorized
        res.json({
          autenticado: false
        })
      } else {
        var token = app.get('jwt').sign({
          usuario: criterio.email,
          tiempo: Date.now() / 1000
        }, "secreto");
        res.status(200);
        res.json({
          autenticado: true,
          token: token
        });
      }

    });
  });

  /**
   * S.2 LISTAR TODOS LOS AMIGOS DEL USUARIO IDENTIFICADO
   */
  app.get("/api/usuarios/", function(req, res) {

    var criterio = {
      personaEmail: res.usuario
    };

    gestorBD.obtenerAmigos(criterio, function(amigos) {
      console.log(res.usuario);
      if (amigos == null) {
        res.status(500);
        res.json({
          error: "se ha producido un error"
        })
      } else {
        res.status(200);
        res.send(JSON.stringify(amigos));
      }
    });
  });

  /**
   * S.3 CREAR MENSAJE
   */
  app.post('/api/mensajes', function(req, res) {

    var criterio = {
      personaEmail: res.usuario,
      amigoEmail: req.body.destino
    };

    gestorBD.obtenerAmigos(criterio, function(amigos) {
      console.log('amigos: ' + amigos);
      if (amigos.length > 0) {
        var mensaje = {
          emisor: res.usuario,
          destino: req.body.destino,
          texto: req.body.texto,
          leido: false
        };

        gestorBD.insertarMensaje(mensaje, function(id) {
          if (id == null) {
            res.status(500);
            res.json({
              error: "se ha producido un error"
            });
          } else {
            res.status(201);
            res.json({
              mensaje: "mensaje insertardo",
              _id: id
            });
          }
        });

      } else {
        res.status(500);
        res.json({
          error: "emisor y receptor no son amigos. Emisor: " + res.usuario
                  + ". Receptor: " + req.body.destino
        });
      }
    });

  });

  /**
   * S.4 OBTENER MIS MENSAJES DE UNA CONVERSACIÓN
   */
  app.get('/api/mensajes', function(req, res) {

    var criterio = {
      '$or': [{
        "emisor": res.usuario,
        "destino": req.query.amigo
      }, {
        "emisor": req.query.amigo,
        "destino": res.usuario
      }]
    };

    gestorBD.obtenerMensajes(criterio, function(mensajes) {
      if (mensajes == null) {
        res.status(500);
        res.json({
          error: "se ha producido un error"
        });
      } else {
        res.status(200);
        console
                .log('mensajes de: ' + res.usuario + ' para: '
                        + req.query.amigo);
        console.log(mensajes);
        res.send(JSON.stringify(mensajes));
      }
    });

  });

};