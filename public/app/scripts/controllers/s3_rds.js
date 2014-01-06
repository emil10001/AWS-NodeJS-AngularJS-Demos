'use strict';

myApp.controller('S3RdsCtrl', function ($scope, SocketService, Constants, S3Service, RdsService) {
    $scope.users = RdsService.users;
    $scope.user;
    $scope.userMedia;

    $scope.$watch("user", function () {
        if (!$scope.user)
            return;
        console.log('selected', $scope.user);
        SocketService.getRdsUserMedia($scope.user.id);

        if (!!$scope.selectedMedia)
            $scope.selectedMedia.url = "http://example.com/";
    });

    $scope.$on(Constants.RDS_GET_USER_MEDIA, function (event, data) {
        $scope.$apply(function () {
            console.log('userMedia=',data);
            $scope.userMedia = data;
            console.log(Constants.RDS_GET_USER_MEDIA, $scope.userMedia);
        });
    });

    $scope.deleteMedia = function(media){
        SocketService.deleteRdsMedia(media.id);
        SocketService.deleteS3(media.mkey);
    };

    $scope.selectUserMedia = function(media){
        $scope.selectedMedia = media;
    };

    $scope.$on(Constants.RDS_SERVICE_UPDATE, function (event, data) {
        $scope.$apply(function () {
            $scope.users = RdsService.users;
            console.log(Constants.RDS_SERVICE_UPDATE, $scope.users);
        });
    });

    $scope.fileInputChange = function () {
        SocketService.getUrlPair();
    };

    $scope.$on(Constants.S3_GET_URLPAIR, function (event, data) {
        if (!$scope.user || $scope.user === {}){
            alert("you need to select a user first!");
            return;
        }

        console.log(Constants.S3_GET_URLPAIR, data);

        var fileInput = document.getElementById('fileInput');
        console.log('detected file', fileInput.files[0]);

        var url = data[Constants.S3_PUT_URL];
        var getUrl = data[Constants.S3_GET_URL];

        var file = fileInput.files[0];
        var userMedia = {
            mkey: data[Constants.S3_KEY],
            uid: $scope.user.id,
            title: file.name,
            type: file.type,
            url: getUrl
        };

        SocketService.putRdsMedia(userMedia);

        S3Service.sendFile(file, url, getUrl);
    });

    $scope.$on(Constants.S3_FILE_DONE, function(event,data){
        $scope.fileImgUrl = data;
        SocketService.getRdsUserMedia($scope.user.id);
    });

    $scope.$on(Constants.RDS_UPDATE_MEDIA, function (event, data) {
        SocketService.getRdsUserMedia($scope.user.id);
    });
    $scope.$on(Constants.RDS_DELETE_MEDIA, function (event, data) {
        SocketService.getRdsUserMedia($scope.user.id);
    });

});
