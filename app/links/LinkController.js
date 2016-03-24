'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    LinkService.findAll().then(links => {
      $scope.links = links;
    });

    $scope.findByTag = function(tag) {
      LinkService.searchByTag([tag.name]).then(links => {
        $scope.links = links;
      });
    }
  }
]);
