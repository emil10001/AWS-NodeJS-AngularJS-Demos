/**
 * Created by ejf3 on 1/6/14.
 */
myApp.controller('SesCtrl', function ($scope, SocketService, Constants, DynamoService) {
    $scope.users = DynamoService.users;
    $scope.user;
    $scope.userMedia;
    $scope.tmpUser = {};

    $scope.unsubscribe = function(){
        if (!$scope.tmpUser.email)
            return;

        var email = $scope.tmpUser.email;
        $scope.tmpUser = {};
        SocketService.unsubscribe(email);
        console.log("unsubscribe",email);
    };
    $scope.sendEmail = function(){
        if (!$scope.user){
            alert('select a user first!');
            return;
        }
        SocketService.sendEmail($scope.user);
    };

    $scope.$watch("user", function () {
        if (!$scope.user)
            return;
        console.log('selected', $scope.user);
        SocketService.getDynUserMedia($scope.user.id);
    });

    $scope.$on(Constants.SES_SEND_EMAIL, function (event, data) {
        $scope.$apply(function () {
            console.log(Constants.SES_SEND_EMAIL, data);
        });
    });

    $scope.$on(Constants.DYN_GET_USER_MEDIA, function (event, data) {
        $scope.$apply(function () {
            $scope.userMedia = data;
            console.log(Constants.DYN_GET_USER_MEDIA, $scope.userMedia);
        });
    });
    
    $scope.$on(Constants.DYN_SERVICE_UPDATE, function (event, data) {
        $scope.$apply(function () {
            $scope.users = DynamoService.users;
            console.log(Constants.DYN_SERVICE_UPDATE, $scope.users);
        });
    });

    $scope.$on(Constants.DYN_UNSUBSCRIBE_EMAIL, function (event, data) {
        $scope.$apply(function () {
            alert(Constants.DYN_UNSUBSCRIBE_EMAIL + ":" + data);
            console.log(Constants.DYN_UNSUBSCRIBE_EMAIL, data);
        });
    });

});