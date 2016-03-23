/*globals io, Visibility, _ */
'use strict';

var app = angular.module('Knowledge', ['restangular']);

app.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:3000');
});
