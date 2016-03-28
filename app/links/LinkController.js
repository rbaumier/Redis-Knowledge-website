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
    $scope.linksCount = 0;
    $scope.currentPage = 1;
    $scope.selectedTags = [];
    $scope.searchMode = {
      type: 'autocomplete'
    };

    function onLinksUpdate(body) {
      $scope.links = body.links;
      $scope.linksCount = body.count;
      linksByPage = body.links.length;
      $scope.setPage(1);
    }

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.changePage = function() {
      LinkService.findLinks({
        offset: ($scope.currentPage - 1) * linksByPage
      }).then(function(body) {
        $scope.links = body.links;
      });
    };

    LinkService.findLinks().then(onLinksUpdate);

    $scope.removeSelected = function(tag) {
      _.remove($scope.selectedTags, tag);
      $scope.tags.push(tag);
      LinkService.findLinks({
        intersect: true,
        tags: $scope.selectedTags.map(function(tag) {
          return tag.name
        })
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
        return LinkService.findLinks({
          tags: $scope.selectedTags.map(function(tag) {
            return tag.name;
          })
        }).then(onLinksUpdate);
      }

      LinkService.findLinks({
        tags: [tag.name]
      }).then(function(links){
        $scope.links = links;
      });
    }

    LinkService.findTags().then(tags => {
      $scope.tags = tags.slice(0, MAX_TAGS);
    });

    $scope.search = function(tag) {
      setTimeout(function() {
        LinkService.findTags({
          pattern: $scope.pattern
        }).then(tags => {
          $scope.tags = tags.slice(0, MAX_TAGS);
          // only show links having ALL the selected tags
          if ($scope.searchMode.type === 'intersection') {
            return;
          }

          // show all links having the tag as a pattern (e.g. "red" works if the link has "redis" as tag)
          LinkService.findLinks({
            intersect: false,
            tags: _.isEmpty($scope.pattern) ? '' : tags.map(function(tag) {
              return tag.name;
            })
          }).then(onLinksUpdate);
        });
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
