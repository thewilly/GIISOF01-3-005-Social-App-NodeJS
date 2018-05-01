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
          }
          db.close();
        });
      }
    });
  }
};