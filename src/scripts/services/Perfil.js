(function() {
  angular.module('myvcFrontApp').factory('Perfil', [
    'App',
    '$q',
    '$cookies',
    '$http',
    function(App,
    $q,
    $cookies,
    $http) {
      var user;
      user = {};
      return {
        setUser: function(usuario) {
          return user = usuario;
        },
        User: function() {
          return user;
        },
        save: function() {
          return user.save();
        },
        id: function() {
          return user.user_id;
        },
        idioma: function() {
          return user.idioma_system;
        },
        setImagen: function(imagen_id,
    imagen_nombre) {
          user.imagen_id = imagen_id;
          return user.imagen_nombre = imagen_nombre;
        },
        setOficial: function(foto_id,
    foto_nombre) {
          user.foto_id = foto_id;
          return user.foto_nombre = foto_nombre;
        },
        nameToShow: function() {
          if (user.tipo === 'Usuario') {
            return user.username.toUpperCase();
          } else {
            return user.nombres + ' ' + user.apellidos;
          }
        },
        deleteUser: function() {
          return user = {};
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=Perfil.js.map
