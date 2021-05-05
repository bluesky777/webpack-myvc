(function() {
  angular.module('myvcFrontApp').factory('DownloadServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var res;
      res = {};
      res.download = function(url,
    defaultFileName) {
        var deferred;
        deferred = $q.defer();
        $http.get(url,
    {
          responseType: "blob"
        }).then(function(data) {
          var blob,
    disposition,
    match,
    type;
          type = data.headers('Content-Type');
          disposition = data.headers('Content-Disposition');
          if (disposition) {
            match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            if (match[1]) {
              defaultFileName = match[1];
            }
          }
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g,
    '_');
          blob = new Blob([data.data],
    {
            type: type
          });
          window.saveAs(blob,
    defaultFileName);
          return deferred.resolve(defaultFileName);
        },
    function(r2) {
          console.log(r2);
          return deferred.reject(r2);
        });
        return deferred.promise;
      };
      res.download2 = function(url,
    defaultFileName) {
        var deferred;
        deferred = $q.defer();
        $http.get(url,
    {
          responseType: 'arraybuffer'
        }).then(function(response) {
          var file,
    fileURL;
          file = new Blob([response],
    {
            type: "Type:application/vnd.ms-excel; charset=UTF-8"
          });
          fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          return deferred.resolve(defaultFileName);
        },
    function(r2) {
          console.log('Pailaaassss',
    r2);
          return deferred.reject(r2);
        });
        return deferred.promise;
      };
      return res;
    }
  ]);

}).call(this);

//# sourceMappingURL=DownloadServ.js.map
