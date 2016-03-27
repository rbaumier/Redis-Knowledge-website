'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    $scope.formHidden = true;

    LinkService.findAllLinks().then(links => {
      $scope.links = links;
    });

    $scope.findByTag = function(tag) {
      LinkService.searchByTag([tag.name]).then(links => {
        $scope.links = links;
      });
    }

    LinkService.findAllTags().then(tags => {
      $scope.tags = tags.slice(0, 10);
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
