'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function findAllLinks(options) {
      return Restangular.all('links').customGET('', {
        offset: options.offset || 0,
        limit: options.limit || 10
      });
    }

    function searchByTag(tags, options) {
      return Restangular.all('links').all('search').getList({
        tags: tags
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

    function create(link) {
      return Restangular.all('links').post(link);
    }

    return {
      findAllLinks: findAllLinks,
      findAllTags: findAllTags,
      searchByPattern: searchByPattern,
      searchByTag: searchByTag,
      create: create
    };
  }]);
