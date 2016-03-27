'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    var linksByPage = 0;

    $scope.formHidden = true;
    $scope.linksCount = 0;
    $scope.currentPage = 1;
    $scope.keepedTags = [];
    $scope.searchMode = {
      type: 'autocomplete'
    };

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.changePage = function() {
      LinkService.findAllLinks({
        offset: $scope.currentPage * linksByPage
      }).then(function(body) {
        $scope.links = body.links;
      });
    };

    LinkService.findAllLinks({}).then(function(body) {
      $scope.links = body.links;
      $scope.linksCount = body.count;
      linksByPage = body.links.length;
    });

    $scope.removeKeeped = function(tag) {
      _.remove($scope.keepedTags, tag);
      $scope.tags.push(tag);
    }

    $scope.leaveIntersection = function() {
      $scope.tags = $scope.tags.concat($scope.keepedTags).sort(function(a,b) {
        return a.count < b.count;
      });
      $scope.keepedTags = [];
    }

    $scope.findByTag = function(tag) {
      if ($scope.searchMode.type === 'intersection') {
        $scope.keepedTags.push(tag);
        $scope.tags = _.filter($scope.tags, function(tag) {
          return !_.find($scope.keepedTags, tag);
        });
        return;
        // return LinkService.searchByTags(tags).then(links => {
        //   $scope.links = links;
        // });
      }

      LinkService.searchByTag([tag.name]).then(links => {
        $scope.links = links;
      });
    }

    LinkService.findAllTags().then(tags => {
      $scope.tags = tags.slice(0, 10);
    });

    $scope.search = function(tag) {
      setTimeout(function() {
        LinkService.searchByPattern($scope.pattern).then(tags => {
          $scope.tags = tags;
          // only show links having ALL the selected tags
          if ($scope.searchMode.type === 'intersection') {
            return LinkService.searchByTags(tags).then(links => {
              $scope.links = links;
            });
          }

          // show all links having the tag as a pattern (e.g. "red" works if the link has "redis" as tag)
          LinkService.searchByTag(tags.map(function(tag) {
            return tag.name;
          })).then(links => {
            $scope.links = links;
          });
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
