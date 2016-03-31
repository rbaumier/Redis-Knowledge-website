'use strict';

var app = angular.module('Knowledge', ['restangular', 'ui.bootstrap']);

app.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:9001');
});
