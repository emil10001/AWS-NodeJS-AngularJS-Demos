'use strict';

// modules
var myUtils = angular.module('publicApp.utils', [
]);
var myServices = angular.module('publicApp.services', [
    'publicApp.utils',
    'ngResource'
]);
var myApp = angular.module('publicApp', [
    'publicApp.utils',
    'publicApp.services',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);

// configure main app
myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/rds', {
            templateUrl: 'views/rds.html',
            controller: 'RdsCtrl'
        })
        .when('/dynamo', {
            templateUrl: 'views/dynamo.html',
            controller: 'DynamoCtrl'
        })
        .when('/s3_dynamo', {
            templateUrl: 'views/s3.html',
            controller: 'S3DynamoCtrl'
        })
        .when('/s3_rds', {
            templateUrl: 'views/s3.html',
            controller: 'S3RdsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
