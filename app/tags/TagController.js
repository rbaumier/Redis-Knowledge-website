'use strict';

angular.module('Knowledge').controller('TagController', ['$scope', 'TagService', 'LinkService',
  function($scope, TagService, LinkService) {
    TagService.findAll().then(tags => {
      $scope.tags = tags.slice(0, 20);
    });

    $scope.findByPattern = function(tag) {
      setTimeout(function() {
        TagService.searchByPattern($scope.pattern).then(tags => {
          // @todo: notify link controller + send tags
          $scope.tags = tags;
        });
      });
    }
  }
]);
