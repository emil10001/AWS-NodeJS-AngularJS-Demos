'use strict';

myApp.controller('RdsCtrl', function ($scope, SocketService, Constants) {
    $scope.users = [];
    $scope.newUser = {};
    $scope.requireId = false;

    $scope.$on(Constants.RDS_GET_USERS, function (event, data) {
        $scope.$apply(function () {
            console.log(Constants.RDS_GET_USERS, data);
            $scope.users = data;
        });
    });

    $scope.$on(Constants.RDS_UPDATE_USER, function (event, data) {
        SocketService.getRdsUsers();
    });
    $scope.$on(Constants.RDS_DELETE_USER, function (event, data) {
        SocketService.getRdsUsers();
    });

    $scope.addUser = function () {
        SocketService.putRdsUser({id: parseInt($scope.newUser.id), name: $scope.newUser.name, email: $scope.newUser.email});
        $scope.newUser = {};
    };

    $scope.deleteUser = function(id){
        SocketService.deleteRdsUser(id);
    };

    SocketService.getRdsUsers();
});
