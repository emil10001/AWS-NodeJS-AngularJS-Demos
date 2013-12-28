'use strict';

myApp.controller('DynamoUsersCtrl', function ($scope, SocketService, Constants) {
    $scope.users = [];
    $scope.newUser = {};

    $scope.$on(Constants.DYN_GET_USERS, function (event, data) {
        $scope.$apply(function () {
            console.log(Constants.DYN_GET_USERS, data);
            $scope.users = data;
        });
    });

    $scope.$on(Constants.DYN_UPDATE_USER, function (event, data) {
        SocketService.getUsers();
    });
    $scope.$on(Constants.DYN_DELETE_USER, function (event, data) {
        SocketService.getUsers();
    });

    $scope.addUser = function () {
        SocketService.putUser({id: parseInt($scope.newUser.id), name: $scope.newUser.name, email: $scope.newUser.email});
        $scope.newUser = {};
    };

    $scope.deleteUser = function(id){
        SocketService.deleteUser(id);
    };

    SocketService.getUsers();
});
