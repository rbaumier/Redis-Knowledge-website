'use strict';

angular.module('Knowledge').controller('LinkController', ['$scope', 'LinkService',
  function($scope, LinkService) {
    var linksByPage = 0;
    var MAX_TAGS = 10;
    var searchModes = {
      intersection: 'intersection',
      autocomplete: 'autocomplete'
    };

    $scope.createFormHidden = true;
    $scope.pagination = {
      linksCount: 0,
      currentPage: 1
    };

    // the tags we want to do the intersection with
    $scope.selectedTags = [];
    $scope.searchMode = {
      type: 'autocomplete'
    };

    // init the links and tags
    LinkService.findLinks().then(onLinksUpdate);
    LinkService.findTags().then(tags => {
      $scope.tags = tags.slice(0, MAX_TAGS);
    });

    // [{name:'a'}, {name:'b'}] -> ['a', 'b']
    function getNames(xs) {
      return xs.map(function(x) {
        return x.name;
      })
    }

    // body = [{count: Number, links: array[Link]}]
    // refresh links and pagination when we receive new links
    function onLinksUpdate(body) {
      $scope.links = body.links;
      $scope.pagination.linksCount = body.count;
      linksByPage = body.links.length;
      $scope.setPage(1);
    }

    function onIntersectionUpdate(tag) {
      $scope.selectedTags.push(tag);
      $scope.tags = _.filter($scope.tags, function(tag) {
        return !_.find($scope.selectedTags, tag);
      });
      return LinkService.findLinksWithIntersect({
        tags: getNames($scope.selectedTags)
      }).then(onLinksUpdate);
    }

    // update the current page
    $scope.setPage = function(page) {
      $scope.pagination.currentPage = page;
    };

    // when the user click on a page number: refresh the links
    $scope.changePage = function() {
      LinkService.findLinks({
        offset: ($scope.pagination.currentPage - 1) * linksByPage
      }).then(function(body) {
        $scope.links = body.links;
      });
    };

    // when the user remove a tag he did an intersection with
    $scope.removeSelected = function(tag) {
      _.remove($scope.selectedTags, tag);
      $scope.tags.push(tag);
      LinkService.findLinksWithIntersect({
        tags: getNames($scope.selectedTags)
      }).then(onLinksUpdate);
    }

    // when the 'intersection' option isn't selected anymore
    $scope.leaveIntersection = function() {
      $scope.tags = $scope.tags.concat($scope.selectedTags);
      $scope.selectedTags = [];
    }

    // when the user select a tag
    $scope.selectTag = function(tag) {
      if ($scope.searchMode.type === searchModes.intersection) {
        return onIntersectionUpdate(tag);
      }
      LinkService.findLinks({
        tags: [tag.name]
      }).then(onLinksUpdate);
    }

    // when the user enter a pattern into the tags input
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
            tags: _.isEmpty($scope.pattern) ? '' : getNames(tags)
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

    // when the user closes the create form: reset fields
    $scope.clean = function() {
      $scope.createFormHidden = false;
      $scope.link = {};
      $scope.errorCreate = '';
    }

    // handle a link creation
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
          $scope.createFormHidden = true;
        })
        .catch(function(err) {
          $scope.errorCreate = err;
        });
    }
  }
]);
