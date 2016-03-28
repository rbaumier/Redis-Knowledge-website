'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function compact(obj) {
      return _.omitBy(obj, function(v) {
        return _.isArray(v) ? _.isEmpty(v) : !v;
      });
    }

    function findLinks(options) {
      options = options || {};
      options.tags = (options.tags || []).join(',');
      return Restangular.all('links').customGET('', compact(options));
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
      findLinks: findLinks,
      findAllTags: findAllTags,
      searchByPattern: searchByPattern,
      create: create
    };
  }]);
