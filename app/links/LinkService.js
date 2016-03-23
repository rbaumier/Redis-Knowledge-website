'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function findAll() {
      return Restangular.all('links').getList();
    }

    function search(tags) {
      return Restangular.all('links').all('search').getList({
        tags: tags.join(',')
      });
    }

    return {
      findAll: findAll,
      search: search
    };
  }]);
