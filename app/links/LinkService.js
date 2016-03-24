'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function findAll() {
      return Restangular.all('links').getList();
    }

    function searchByTag(tags, options) {
      return Restangular.all('links').all('search').getList({
        tags: tags.join(',')
      });
    }

    return {
      findAll: findAll,
      searchByTag: searchByTag
    };
  }]);
