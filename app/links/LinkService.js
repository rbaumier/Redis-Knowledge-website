'use strict';

angular.module('Knowledge')
  .factory('LinkService', ['Restangular', function(Restangular) {
    function compact(obj) {
      return _.omitBy(obj, function(v) {
        return _.isArray(v) ? _.isEmpty(v) : !v;
      });
    }

    function formatLinksOptions(options) {
      options.filters = (options.filters || []).join(',');
      return compact(options);
    }

    function findLinks(options) {
      return Restangular.all('links').customGET('', formatLinksOptions(options || {}));
    }

    function findLinksWithIntersect(options) {
      options.intersect = true;
      return findLinks(options);
    }

    function findTags(options) {
      return Restangular.all('tags').customGET('', compact(options || {}));
    }

    function create(link) {
      return Restangular.all('links').post(link);
    }

    return {
      findLinks: findLinks,
      findLinksWithIntersect: findLinksWithIntersect,
      findTags: findTags,
      create: create
    };
  }]);
