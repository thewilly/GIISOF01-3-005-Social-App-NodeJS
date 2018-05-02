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
      console.log(seguro);

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

};
