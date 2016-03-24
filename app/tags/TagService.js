'use strict';

angular.module('Knowledge')
  .factory('TagService', ['Restangular', function(Restangular) {
    function findAll() {
      return Restangular.all('tags').getList();
    }

    function searchByPattern(pattern) {
      return Restangular.all('tags').all('search').getList({
        pattern: pattern
      });
    }

    return {
      findAll: findAll,
      searchByPattern: searchByPattern
    };
  }]);
