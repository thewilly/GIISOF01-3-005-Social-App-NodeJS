module.exports = function(app, swig, gestorBD) {

  /* AW_CU_01
   * Controller for the registration end-point.
   */
  app.get("/registrarse", function(req, res) {
    var respuesta = swig.renderFile('views/bregistro.html', {});
    res.send(respuesta);
  });

  /* Controller for the register / login 
   * 
   */
  app.post('/usuario', function(req, res) {
    var seguro = app.get("crypto").createHmac('sha256',
        app.get('clave')).update(req.body.password)
      .digest('hex');
   
    var usuario = {
      email: req.body.email,
      name: req.doby.name,
      password: seguro
    };

    gestorBD.insertarUsuario(usuario, function(id) {
      if (id == null) {
        res.redirect("/registrarse?mensaje=Error al registrar usuario");
      } else {
        res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
      }
    });
  });

};
