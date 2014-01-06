'use strict';

myApp.controller('DynamoCtrl', function ($scope, SocketService, DynamoService, Constants) {
    $scope.users = DynamoService.users;
    $scope.newUser = {};
    $scope.requireId = true;

    $scope.$on(Constants.DYN_SERVICE_UPDATE, function (event, data) {
        $scope.$apply(function () {
            $scope.users = DynamoService.users;
            console.log(Constants.DYN_SERVICE_UPDATE, $scope.users);
        });
    });

    $scope.addUser = function () {
        SocketService.putDynUser({id: DynamoService.calcId(), name: $scope.newUser.name, email: $scope.newUser.email});
        $scope.newUser = {};
    };

    $scope.deleteUser = function(id){
        SocketService.deleteUser(id);
    };

});
