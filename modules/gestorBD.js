module.exports = {
  mongo: null,
  app: null,

  init: function(app, mongo) {
    this.mongo = mongo;
    this.app = app;
  },

  insertarUsuario: function(usuario, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        console.log('[ERROR] : At inserting user in database: ' + err);
        funcionCallback(null);
      } else {
        console.log('[INFO] : Inserting user in the database');
        var collection = db.collection('usuarios');
        collection.insert(usuario, function(err, result) {
          if (err) {
            console.log('[ERROR] : At inserting user in database: ' + err);
            funcionCallback(null);
          } else {
            console.log('[INFO] : User inserted in database');
            funcionCallback(result.ops[0]._id);
          }
          db.close();
        });
      }
    });
  },

  obtenerUsuariosPg: function(criterio, pg, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('usuarios');

        collection.count(function(err, count) {
          collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(
                  function(err, canciones) {
                    if (err) {
                      funcionCallback(null);
                    } else {
                      funcionCallback(canciones, count);
                    }
                    db.close();
                  });
        });
      }

    });
  },

  obtenerUsuarios: function(criterio, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('usuarios');
        
        collection.find(criterio).toArray(function(err, usuarios) {
          if (err) {
            funcionCallback(null);
          } else {
            funcionCallback(usuarios);
            console.log('criterio: ' + criterio);
            console.log('users: ' + usuarios);
          }
          db.close();
        });
      }
    });
  },

  login: function(criterio, funcionCallback) {

    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('usuarios');
        collection.find(criterio).toArray(function(err, usuarios) {
          if (err) {
            funcionCallback(null);
          } else {
            funcionCallback(usuarios);
          }
          db.close();
        });
      }
    });
  },

  obtenerAmigos: function(criterio, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('amigos');
        collection.find(criterio).toArray(function(err, amigos) {
          if (err) {
            funcionCallback(null);
          } else {
            funcionCallback(amigos);
          }
          db.close();
        });
      }

    });
  },

  obtenerPeticiones: function(criterio, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('peticiones');
        collection.find(criterio).toArray(function(err, peticiones) {
          if (err) {
            funcionCallback(null);
          } else {
            funcionCallback(peticiones);
          }
          db.close();
        });
      }

    });
  },

  obtenerInvitacionesPg: function(criterio, pg, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('peticiones');

        collection.count(function(err, count) {
          collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(
                  function(err, canciones) {
                    if (err) {
                      funcionCallback(null);
                    } else {
                      funcionCallback(canciones, count);
                    }
                    db.close();
                  });
        });
      }
    });
  },

  insertarPeticion: function(peticion, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('peticiones');
        collection.insert(peticion, function(err, result) {
          if (err) {
            funcionCallback(null);
          } else {
            console.log('Petición insertada correctamente');
            funcionCallback(result.ops[0]._id);
          }
          db.close();
        });
      }
    });
  },
  
  eliminarInvitacion : function(invitacion, functionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        console.log(err);
        functionCallback(false);
      } else {
        var peticiones = db.collection('peticiones');
        peticiones.remove(invitacion, function(err, obj) {
          if(err) {
            console.log(err);
            functionCallback(false);
          } else {
            console.log('Petición eliminada correctamente');
            functionCallback(true);
          }
        });
      }
    });
  },

  insertarAmigo: function(amigo, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        console.log(err);
        funcionCallback(null);
      } else {
        var collection = db.collection('amigos');
        collection.insert(amigo, function(err, result) {
          if (err) {
            console.log(err);
            funcionCallback(null);
          } else {
            console.log('Amigo insertado correctamente');
            funcionCallback(result.ops[0]._id);
          }
          db.close();
        });
      }

    });
  },

  obtenerAmigosPg: function(criterio, pg, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('amigos');

        collection.count(function(err, count) {
          collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(
                  function(err, canciones) {
                    if (err) {
                      funcionCallback(null);
                    } else {
                      funcionCallback(canciones, count);
                    }
                    db.close();
                  });
        });
      }
    });
  },
  
  insertarMensaje: function(mensaje, functionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        functionCallback(null);
      } else {
        var mensajes = db.collection('mensajes');
        
        mensajes.insert(mensaje, function(err, result) {
          if(err) {
            functionCallback(null);
          } else {
            console.log('Mensaje insertado correctamente');
            functionCallback(result.ops[0]._id);
          }
          db.close();
        });
      }
    });
  },
  
  obtenerMensajes: function(criterio, functionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        functionCallback(null);
      } else {
        var mensajes = db.collection('mensajes');
        
        mensajes.find(criterio).toArray(function(err, mensajes) {
          if (err) {
            functionCallback(null);
          } else {
            functionCallback(mensajes);
          }
          db.close();
        });
      }
    });
  }
  
  
};