'use strict';

myApp.controller('S3DynamoCtrl', function ($scope, SocketService, Constants, S3Service, DynamoService) {
    $scope.users = [];
    $scope.user;
    $scope.userMedia;

    $scope.$watch("user", function () {
        if (!$scope.user)
            return;
        console.log('selected', $scope.user);
        SocketService.getDynUserMedia($scope.user.id);

        if (!!$scope.selectedMedia)
            $scope.selectedMedia.url = "http://example.com/";
    });

    $scope.$on(Constants.DYN_GET_USER_MEDIA, function (event, data) {
        $scope.$apply(function () {
            $scope.userMedia = data;
            console.log(Constants.DYN_GET_USER_MEDIA, $scope.userMedia);

            if ($scope.userMedia.length < 1 &&!!$scope.selectedMedia)
                $scope.selectedMedia.url = "http://example.com/";
        });
    });

    $scope.selectUserMedia = function (media) {
        $scope.selectedMedia = media;
    };

    $scope.deleteMedia = function(media){
        SocketService.deleteDynMedia(media.id);
        SocketService.deleteS3(media.id);
    };

    $scope.$on(Constants.DYN_SERVICE_UPDATE, function (event, data) {
        $scope.$apply(function () {
            $scope.users = DynamoService.users;
            console.log(Constants.DYN_SERVICE_UPDATE, $scope.users);
        });
    });

    $scope.fileInputChange = function () {
        SocketService.getUrlPair();
    };

    $scope.$on(Constants.S3_GET_URLPAIR, function (event, data) {
        if (!$scope.user || $scope.user === {}) {
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
            id: data[Constants.S3_KEY],
            uid: $scope.user.id,
            title: file.name,
            type: file.type,
            url: getUrl
        };

        console.log('add dynamo media item', userMedia);
        SocketService.putDynMedia(userMedia);

        S3Service.sendFile(file, url, getUrl);
    });

    $scope.$on(Constants.S3_FILE_DONE, function (event, data) {
        $scope.fileImgUrl = data;
        SocketService.getDynUserMedia($scope.user.id);
    });

    $scope.$on(Constants.DYN_UPDATE_MEDIA, function (event, data) {
        SocketService.getDynUserMedia($scope.user.id);
    });
    $scope.$on(Constants.DYN_DELETE_MEDIA, function (event, data) {
        SocketService.getDynUserMedia($scope.user.id);
    });

});
