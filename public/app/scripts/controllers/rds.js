'use strict';

myApp.controller('RdsCtrl', function ($scope, SocketService, RdsService, Constants) {
    $scope.users = [];
    $scope.newUser = {};
    $scope.requireId = false;

    $scope.$on(Constants.RDS_SERVICE_UPDATE, function (event, data) {
        $scope.$apply(function () {
            $scope.users = RdsService.users;
            console.log(Constants.RDS_SERVICE_UPDATE, $scope.users);
        });
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
