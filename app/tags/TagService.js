'use strict';

angular.module('Knowledge')
  .factory('TagService', ['Restangular', function(Restangular) {
    function findAll() {
      return Restangular.all('tags').getList();
    }

    return {
      findAll: findAll
    };
  }]);
