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

  obtenerUsuarios: function(pg, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('usuarios');

        collection.count(function(err, count) {
          collection.find().skip((pg - 1) * 5).limit(5).toArray(
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
        collection.find().toArray(function(err, amigos) {
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
            funcionCallback(result.ops[0]._id);
          }
          db.close();
        });
      }
    });
  },

  aceptarPeticion: function(peticion, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var amigos = db.collection('amigos');
        amigos.insert(peticion, function(err, result) {
          if (err) {
            console.log(err);
          }
          db.close();
        });

        var remove = {
          send: peticion.amigoEmail,
          sendName: peticion.amigoName,
          aNombre: peticion.yoName,
          aEmail: peticion.yoEmail
        }

        var peticiones = db.collection('peticiones');
        peticiones.remove(remove, function(err, obj) {
          if (err) {
            console.log(err);
          } else {
            funcionCallback('finished');
          }
          db.close();
        });
      }
    });
  },

  insertarAmigo: function(amigo, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(null);
      } else {
        var collection = db.collection('amigos');
        collection.insert(amigo, function(err, result) {
          if (err) {
            funcionCallback(null);
          } else {
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
  }
};