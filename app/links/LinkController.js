'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    var linksByPage = 0;
    var MAX_TAGS = 10;
    var searchModes = {
      intersection: 'intersection',
      autocomplete: 'autocomplete'
    };

    $scope.formHidden = true;
    $scope.pagination = {
      linksCount: 0,
      currentPage: 1
    };

    $scope.selectedTags = [];
    $scope.searchMode = {
      type: 'autocomplete'
    };

    LinkService.findLinks().then(onLinksUpdate);
    LinkService.findTags().then(tags => {
      $scope.tags = tags.slice(0, MAX_TAGS);
    });

    function getNames(xs) {
      return xs.map(function(x) {
        return x.name;
      })
    }

    function onLinksUpdate(body) {
      $scope.links = body.links;
      $scope.pagination.linksCount = body.count;
      linksByPage = body.links.length;
      $scope.setPage(1);
    }

    $scope.setPage = function(page) {
      $scope.pagination.currentPage = page;
    };

    $scope.changePage = function() {
      LinkService.findLinks({
        offset: ($scope.pagination.currentPage - 1) * linksByPage
      }).then(function(body) {
        $scope.links = body.links;
      });
    };


    $scope.removeSelected = function(tag) {
      _.remove($scope.selectedTags, tag);
      $scope.tags.push(tag);
      LinkService.findLinksWithIntersect({
        filters: getNames($scope.selectedTags)
      }).then(onLinksUpdate);
    }

    $scope.leaveIntersection = function() {
      $scope.tags = $scope.tags.concat($scope.selectedTags);
      $scope.selectedTags = [];
    }

    $scope.selectTag = function(tag) {
      if ($scope.searchMode.type === searchModes.intersection) {
        $scope.selectedTags.push(tag);
        $scope.tags = _.filter($scope.tags, function(tag) {
          return !_.find($scope.selectedTags, tag);
        });
        return LinkService.findLinksWithIntersect({
          filters: getNames($scope.selectedTags)
        }).then(onLinksUpdate);
      }

      LinkService.findLinks({
        filters: [tag.name]
      }).then(onLinksUpdate);
    }

    $scope.search = function(tag) {
      setTimeout(function() {
        LinkService.findTags({
          pattern: $scope.pattern
        }).then(tags => {
          $scope.tags = tags.slice(0, MAX_TAGS);
          // only show links having ALL the selected tags
          if ($scope.searchMode.type === searchModes.intersection) {
            return;
          }
          // show all links having the tag as a pattern (e.g. "red" works if the link has "redis" as tag)
          LinkService.findLinks({
            filters: _.isEmpty($scope.pattern) ? '' : getNames(tags)
          }).then(onLinksUpdate);
        });
      });
    }

    // the api doesn't work (http://localhost:9001/links?q=shard)
    $scope.searchByTitle = function() {
      setTimeout(function() {
        LinkService.findLinks({
          q: $scope.title
        }).then(onLinksUpdate);
      });
    }

    $scope.clean = function() {
      $scope.formHidden = false;
      $scope.link = {};
      $scope.errorCreate = '';
    }

    $scope.create = function(link) {
      if (!link || !link.title) {
        return $scope.errorCreate = 'You need to provide a title';
      }

      if (!link.url || !(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(link.url)) {
        return $scope.errorCreate = 'You need to provide a valid url';
      }

      if (!link.tags) {
        return $scope.errorCreate = 'You need to provide some tags';
      }

      LinkService.create(_.assign({}, link, {
          tags: link.tags.split(' ')
        }))
        .then(function() {
          $scope.formHidden = true;
        })
        .catch(function(err) {
          $scope.errorCreate = err;
        });
    }
  }
]);
