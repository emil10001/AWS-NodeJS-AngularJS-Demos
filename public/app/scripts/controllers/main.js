'use strict';

myApp.controller('MainCtrl', function ($scope, SocketService, Constants) {
    $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];

    $scope.$on(Constants.DYN_GET_USERS, function (event, data) {
        $scope.$apply(function(){
            console.log(Constants.DYN_GET_USERS, data);
            $scope.awesomeThings = data;
        });
    });

    SocketService.getUsers();
});
