'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function findAll() {
      return Restangular.all('links').getList();
    }

    return {
      findAll: findAll
    };
  }]);
