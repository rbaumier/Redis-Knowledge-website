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

    function findTags(options) {
      return Restangular.all('tags').customGET('', compact(options || {}));
    }

    function create(link) {
      return Restangular.all('links').post(link);
    }

    return {
      findLinks: findLinks,
      findTags: findTags,
      create: create
    };
  }]);
