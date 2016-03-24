'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function findAllLinks() {
      return Restangular.all('links').getList();
    }

    function searchByTag(tags, options) {
      return Restangular.all('links').all('search').getList({
        tags: tags.join(',')
      });
    }

    function findAllTags() {
      return Restangular.all('tags').getList();
    }

    function searchByPattern(pattern) {
      return Restangular.all('tags').all('search').getList({
        pattern: pattern
      });
    }

    return {
      findAllLinks: findAllLinks,
      findAllTags: findAllTags,
      searchByPattern: searchByPattern,
      searchByTag: searchByTag
    };
  }]);
