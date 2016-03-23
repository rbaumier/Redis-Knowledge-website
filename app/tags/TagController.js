'use strict';

angular.module('Knowledge').controller('TagController', ['$scope', 'TagService',
  function($scope, TagService) {
    TagService.findAll().then(tags => {
      $scope.tags = tags.slice(0, 20);
    })
  }
]);
