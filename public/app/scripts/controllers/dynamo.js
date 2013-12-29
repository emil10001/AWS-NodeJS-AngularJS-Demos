'use strict';

myApp.controller('DynamoCtrl', function ($scope, SocketService, Constants) {
    $scope.users = [];
    $scope.newUser = {};
    $scope.requireId = true;

    $scope.$on(Constants.DYN_GET_USERS, function (event, data) {
        $scope.$apply(function () {
            console.log(Constants.DYN_GET_USERS, data);
            $scope.users = data;
        });
    });

    $scope.$on(Constants.DYN_UPDATE_USER, function (event, data) {
        SocketService.getDynUsers();
    });
    $scope.$on(Constants.DYN_DELETE_USER, function (event, data) {
        SocketService.getDynUsers();
    });

    $scope.addUser = function () {
        SocketService.putDynUser({name: $scope.newUser.name, email: $scope.newUser.email});
        $scope.newUser = {};
    };

    $scope.deleteUser = function(id){
        SocketService.deleteDynUser(id);
    };

    SocketService.getDynUsers();
});
