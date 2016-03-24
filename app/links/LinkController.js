'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    LinkService.findAllLinks().then(links => {
      $scope.links = links;
    });

    $scope.findByTag = function(tag) {
      LinkService.searchByTag([tag.name]).then(links => {
        $scope.links = links;
      });
    }

    LinkService.findAllTags().then(tags => {
      $scope.tags = tags.slice(0, 20);
    });

    $scope.findByPattern = function(tag) {
      setTimeout(function() {
        LinkService.searchByPattern($scope.pattern).then(tags => {
          $scope.tags = tags;
          LinkService.searchByTag(tags.map(function(tag) {
            return tag.name;
          })).then(links => {
            $scope.links = links;
          });
        });
      });
    }
  }
]);
